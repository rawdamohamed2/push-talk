from redis.exceptions import RedisError
from sqlalchemy.orm import Session

from app.config import settings
from app.errors import AppError
from app.models import Message, User
from app.queue import audio_queue
from app.services import channels as channel_service
from app.services.audio import probe_audio
from app.services.storage import storage
from pathlib import Path

from redis.exceptions import RedisError
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.config import settings
from app.errors import AppError
from app.models import Message, MessageReceipt, User
from app.queue import audio_queue
from app.schemas.message import MessageOut
from app.services import channels as channel_service
from app.services.audio import probe_audio
from app.services.storage import storage

def submit_audio(db: Session, user: User, channel_id: int, data: bytes) -> Message:
    channel_service.ensure_member(db, channel_id, user.id)

    if not data:
        raise AppError(400, "empty_file", "The audio file is empty")
    if len(data) > settings.max_upload_bytes:
        raise AppError(413, "file_too_large", "The audio file is too large")

    raw_path = storage.save_raw(data)
    try:
        probe_audio(storage.full_path(raw_path))
    except AppError:
        storage.delete(raw_path) 
        raise

    message = Message(channel_id=channel_id, sender_id=user.id, status="processing", raw_path=raw_path)
    db.add(message)
    db.commit()

    try:
        audio_queue.enqueue("app.worker.process_message", message.id)
    except RedisError:
        message.status = "failed"
        message.error = "queue_unavailable"
        db.commit()
        storage.delete(raw_path)
        raise AppError(503, "queue_unavailable", "Could not queue the message, try again") from None
    return message

def _delivery_statuses(db: Session, message_ids: list[int]) -> dict[int, str]:
    if not message_ids:
        return {}
    rows = db.execute(
        select(
            MessageReceipt.message_id,
            func.count(MessageReceipt.delivered_at),
            func.count(MessageReceipt.played_at),
        )
        .where(MessageReceipt.message_id.in_(message_ids))
        .group_by(MessageReceipt.message_id)
    ).all()
    return {
        mid: "played" if played else "delivered" if delivered else "sent"
        for mid, delivered, played in rows
    }


def list_history(
    db: Session,
    user: User,
    channel_id: int,
    before_seq: int | None,
    after_seq: int | None,
    limit: int,
) -> list[MessageOut]:
    channel_service.ensure_member(db, channel_id, user.id)
    if before_seq is not None and after_seq is not None:
        raise AppError(400, "invalid_query", "Use either before_seq or after_seq, not both")

    query = (
        select(Message, User.username)
        .join(User, User.id == Message.sender_id)
        .where(Message.channel_id == channel_id, Message.status == "sent")
    )
    if after_seq is not None:
        rows = db.execute(query.where(Message.seq > after_seq).order_by(Message.seq).limit(limit)).all()
    else:
        if before_seq is not None:
            query = query.where(Message.seq < before_seq)
        rows = list(reversed(db.execute(query.order_by(Message.seq.desc()).limit(limit)).all()))

    mine = [m.id for m, _ in rows if m.sender_id == user.id]
    statuses = _delivery_statuses(db, mine)
    return [
        MessageOut(
            id=m.id,
            channel_id=m.channel_id,
            sender_id=m.sender_id,
            sender_name=username,
            seq=m.seq,
            status=m.status,
            duration_ms=m.duration_ms,
            peaks=m.peaks,
            delivery_status=statuses.get(m.id, "sent"),
            created_at=m.created_at,
        )
        for m, username in rows
    ]


def audio_file_for(db: Session, user: User, message_id: int) -> Path:

    message = db.get(Message, message_id)
    if message is None:
        raise AppError(404, "message_not_found", "Message not found")
    channel_service.ensure_member(db, message.channel_id, user.id)
    if message.status != "sent" or not message.audio_path:
        raise AppError(404, "audio_not_ready", "Audio is not available")
    path = storage.full_path(message.audio_path)
    if not path.is_file():
        raise AppError(404, "audio_not_ready", "Audio is not available")
    return path
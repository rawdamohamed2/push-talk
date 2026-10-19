import logging

from redis import Redis
from sqlalchemy import update
from sqlalchemy.orm import Session

from app.config import settings
from app.db import SessionLocal
from app.models import Channel, Message, User
from app.schemas.message import MessageOut
from app.services.audio import convert_to_ogg, extract_peaks, ogg_duration_ms
from app.services.storage import storage

logger = logging.getLogger("pushtalk.worker")
redis_client = Redis.from_url(settings.redis_url)


def event_channel(channel_id: int) -> str:
    return f"channel:{channel_id}"


def _publish(db: Session, message: Message, event_type: str) -> None:
    sender = db.get(User, message.sender_id)
    payload = MessageOut(
        id=message.id,
        channel_id=message.channel_id,
        sender_id=message.sender_id,
        sender_name=sender.username if sender else "unknown",
        seq=message.seq,
        status=message.status,
        duration_ms=message.duration_ms,
        peaks=message.peaks,
        created_at=message.created_at,
    )
    body = {"type": event_type, "message": payload.model_dump(mode="json", by_alias=True)}
    redis_client.publish(event_channel(message.channel_id), __import__("json").dumps(body))


def _fail(db: Session, message_id: int, reason: str) -> None:
    db.rollback()
    message = db.get(Message, message_id)
    if message is None:
        return
    message.status = "failed"
    message.error = reason[:250]
    db.commit()
    _publish(db, message, "message.failed")


def process_message(message_id: int) -> None:
    with SessionLocal() as db:
        message = db.get(Message, message_id)
        if message is None or message.status != "processing" or not message.raw_path:
            return 

        logger.info("processing_started", extra={"message_id": message_id})
        raw_rel = message.raw_path
        out_rel = f"processed/{message_id}.ogg"
        try:
            out_path = storage.full_path(out_rel)
            convert_to_ogg(storage.full_path(raw_rel), out_path)
            duration_ms = ogg_duration_ms(out_path)
            peaks = extract_peaks(out_path)

            seq = db.execute(
                update(Channel)
                .where(Channel.id == message.channel_id)
                .values(last_seq=Channel.last_seq + 1)
                .returning(Channel.last_seq)
            ).scalar_one()

            message.seq = seq
            message.audio_path = out_rel
            message.duration_ms = duration_ms
            message.peaks = peaks
            message.raw_path = None
            message.status = "sent"
            db.commit()
        except Exception as exc:  
            logger.exception("processing_failed", extra={"message_id": message_id})
            storage.delete(out_rel)
            storage.delete(raw_rel)
            _fail(db, message_id, str(exc))
            return

        storage.delete(raw_rel)
        _publish(db, message, "message.new") 
        logger.info("processing_done", extra={"message_id": message_id, "seq": seq})
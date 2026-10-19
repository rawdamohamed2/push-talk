import json

import jwt
from redis.asyncio import Redis
from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.db import SessionLocal
from app.errors import AppError
from app.models import Message, MessageReceipt, User
from app.security import decode_token
from app.services import channels as channel_service


class SocketAuthError(Exception):

    def __init__(self, code: int) -> None:
        super().__init__(code)
        self.code = code


def event_channel(channel_id: int) -> str:
    return f"channel:{channel_id}"


def authorize_socket(token: str, channel_id: int) -> int:
    try:
        user_id = decode_token(token)
    except jwt.PyJWTError:
        raise SocketAuthError(4401) from None
    with SessionLocal() as db:
        if db.get(User, user_id) is None:
            raise SocketAuthError(4401)
        try:
            channel_service.ensure_member(db, channel_id, user_id)
        except AppError:
            raise SocketAuthError(4403) from None
    return user_id



async def publish(redis: Redis, channel_id: int, event: dict) -> None:
    await redis.publish(event_channel(channel_id), json.dumps(event))


def _presence_key(channel_id: int) -> str:
    return f"presence:{channel_id}"


async def mark_online(redis: Redis, channel_id: int, user_id: int) -> bool:
    return await redis.hincrby(_presence_key(channel_id), str(user_id), 1) == 1


async def mark_offline(redis: Redis, channel_id: int, user_id: int) -> bool:
    left = await redis.hincrby(_presence_key(channel_id), str(user_id), -1)
    if left <= 0:
        await redis.hdel(_presence_key(channel_id), str(user_id))
        return True
    return False


async def online_ids(redis: Redis, channel_id: int) -> list[int]:
    return sorted(int(k) for k in await redis.hkeys(_presence_key(channel_id)))


def _aggregate(db: Session, message_id: int) -> str:
    delivered, played = db.execute(
        select(func.count(MessageReceipt.delivered_at), func.count(MessageReceipt.played_at))
        .where(MessageReceipt.message_id == message_id)
    ).one()
    return "played" if played else "delivered" if delivered else "sent"


def _target(db: Session, message_id: int, channel_id: int, user_id: int) -> Message | None:
    message = db.get(Message, message_id)
    if (
        message is None
        or message.channel_id != channel_id
        or message.sender_id == user_id
        or message.status != "sent"
    ):
        return None
    return message


def record_delivered(message_id: int, channel_id: int, user_id: int) -> str | None:
    with SessionLocal() as db:
        if _target(db, message_id, channel_id, user_id) is None:
            return None
        before = _aggregate(db, message_id)
        db.execute(
            insert(MessageReceipt)
            .values(message_id=message_id, user_id=user_id, delivered_at=func.now())
            .on_conflict_do_nothing()
        )
        db.commit()
        after = _aggregate(db, message_id)
        return after if after != before else None


def record_played(message_id: int, channel_id: int, user_id: int) -> str | None:
    with SessionLocal() as db:
        if _target(db, message_id, channel_id, user_id) is None:
            return None
        before = _aggregate(db, message_id)
        stmt = insert(MessageReceipt).values(
            message_id=message_id, user_id=user_id,
            delivered_at=func.now(), played_at=func.now(),
        )
        db.execute(
            stmt.on_conflict_do_update(
                index_elements=["message_id", "user_id"],
                set_={
                    "delivered_at": func.coalesce(MessageReceipt.delivered_at, func.now()),
                    "played_at": func.coalesce(MessageReceipt.played_at, func.now()),
                },
            )
        )
        db.commit()
        after = _aggregate(db, message_id)
        return after if after != before else None
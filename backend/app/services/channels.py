from sqlalchemy import exists, func, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.errors import AppError
from app.models import Channel, ChannelMember, User
from app.schemas.channel import ChannelOut


def _channel_select(user_id: int):
    
    member_count = (
        select(func.count())
        .select_from(ChannelMember)
        .where(ChannelMember.channel_id == Channel.id)
        .scalar_subquery()
    )
    is_member = exists().where(
        ChannelMember.channel_id == Channel.id,
        ChannelMember.user_id == user_id,
    )
    return select(
        Channel.id,
        Channel.name,
        member_count.label("member_count"),
        is_member.label("is_member"),
    )


def list_channels(db: Session, user: User) -> list[ChannelOut]:
    rows = db.execute(_channel_select(user.id).order_by(Channel.name)).all()
    return [ChannelOut(**row._mapping) for row in rows]


def get_channel(db: Session, channel_id: int, user: User) -> ChannelOut:
    row = db.execute(_channel_select(user.id).where(Channel.id == channel_id)).first()
    if row is None:
        raise AppError(404, "channel_not_found", "Channel not found")
    return ChannelOut(**row._mapping)


def create_channel(db: Session, user: User, name: str) -> ChannelOut:
    channel = Channel(name=name)
    db.add(channel)
    try:
        db.flush() 
    except IntegrityError:
        db.rollback()
        raise AppError(409, "channel_name_taken", "A channel with this name already exists") from None
    db.add(ChannelMember(channel_id=channel.id, user_id=user.id))  
    db.commit()
    return get_channel(db, channel.id, user)


def join_channel(db: Session, user: User, channel_id: int) -> ChannelOut:
    get_channel(db, channel_id, user)  
    db.execute(
        insert(ChannelMember)
        .values(channel_id=channel_id, user_id=user.id)
        .on_conflict_do_nothing()
    )
    db.commit()
    return get_channel(db, channel_id, user)


def ensure_member(db: Session, channel_id: int, user_id: int) -> None:
    is_member = db.scalar(
        select(
            exists().where(
                ChannelMember.channel_id == channel_id,
                ChannelMember.user_id == user_id,
            )
        )
    )
    if not is_member:
        raise AppError(403, "not_a_member", "Join this channel first")


def list_members(db: Session, channel_id: int, user: User) -> list[User]:
    ensure_member(db, channel_id, user.id)
    return list(
        db.scalars(
            select(User)
            .join(ChannelMember, ChannelMember.user_id == User.id)
            .where(ChannelMember.channel_id == channel_id)
            .order_by(User.username)
        )
    )
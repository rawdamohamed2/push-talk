from datetime import datetime

from sqlalchemy import (
    CheckConstraint, DateTime, Float, ForeignKey, String, UniqueConstraint, func,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(30), unique=True) 
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Channel(Base):
    __tablename__ = "channels"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True)
    last_seq: Mapped[int] = mapped_column(default=0, server_default="0")  
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class ChannelMember(Base):
    __tablename__ = "channel_members"

    channel_id: Mapped[int] = mapped_column(ForeignKey("channels.id", ondelete="CASCADE"), primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Message(Base):
    __tablename__ = "messages"
    __table_args__ = (
        UniqueConstraint("channel_id", "seq", name="uq_messages_channel_seq"),
        CheckConstraint("status in ('processing', 'sent', 'failed')", name="ck_messages_status"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    channel_id: Mapped[int] = mapped_column(ForeignKey("channels.id", ondelete="CASCADE"))
    sender_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    seq: Mapped[int | None]                     
    status: Mapped[str] = mapped_column(String(20), default="processing", server_default="processing")
    raw_path: Mapped[str | None] = mapped_column(String(255))
    audio_path: Mapped[str | None] = mapped_column(String(255))
    duration_ms: Mapped[int | None]
    peaks: Mapped[list[float] | None] = mapped_column(ARRAY(Float))
    error: Mapped[str | None] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class MessageReceipt(Base):
    __tablename__ = "message_receipts"

    message_id: Mapped[int] = mapped_column(ForeignKey("messages.id", ondelete="CASCADE"), primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    played_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
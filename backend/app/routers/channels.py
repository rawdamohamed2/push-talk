from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import current_user
from app.models import User
from app.schemas.auth import UserOut
from app.schemas.channel import ChannelOut, CreateChannelRequest
from app.services import channels as channel_service

router = APIRouter(prefix="/channels", tags=["channels"])


@router.get("", response_model=list[ChannelOut])
def list_channels(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return channel_service.list_channels(db, user)


@router.post("", response_model=ChannelOut, status_code=201)
def create_channel(
    body: CreateChannelRequest,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    return channel_service.create_channel(db, user, body.name)


@router.post("/{channel_id}/join", response_model=ChannelOut)
def join_channel(channel_id: int, user: User = Depends(current_user), db: Session = Depends(get_db)):
    return channel_service.join_channel(db, user, channel_id)


@router.get("/{channel_id}/members", response_model=list[UserOut])
def list_members(channel_id: int, user: User = Depends(current_user), db: Session = Depends(get_db)):
    return channel_service.list_members(db, channel_id, user)
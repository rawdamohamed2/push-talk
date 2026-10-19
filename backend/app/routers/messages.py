from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.orm import Session

from app.config import settings
from app.db import get_db
from app.deps import current_user
from app.models import User
from app.schemas.message import UploadResponse
from app.services import messages as message_service
from fastapi import APIRouter, Depends, Query, UploadFile
from fastapi.responses import FileResponse

from app.schemas.message import MessageOut, UploadResponse
router = APIRouter(tags=["messages"])


@router.post("/channels/{channel_id}/messages", response_model=UploadResponse, status_code=202)
def upload_message(
    channel_id: int,
    audio: UploadFile,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    data = audio.file.read(settings.max_upload_bytes + 1)
    return message_service.submit_audio(db, user, channel_id, data)

@router.get("/channels/{channel_id}/messages", response_model=list[MessageOut])
def list_messages(
    channel_id: int,
    before_seq: int | None = Query(None, ge=1),
    after_seq: int | None = Query(None, ge=0),
    limit: int = Query(20, ge=1, le=100),
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    return message_service.list_history(db, user, channel_id, before_seq, after_seq, limit)


@router.get("/messages/{message_id}/audio")
def get_audio(message_id: int, user: User = Depends(current_user), db: Session = Depends(get_db)):
    path = message_service.audio_file_for(db, user, message_id)
    return FileResponse(path, media_type="audio/ogg", headers={"Cache-Control": "private, max-age=3600"})
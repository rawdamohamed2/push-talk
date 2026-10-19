from datetime import datetime

from app.schemas.base import CamelModel

class UploadResponse(CamelModel):
    id: int
    status: str

class MessageOut(CamelModel):
    id: int
    channel_id: int
    sender_id: int
    sender_name: str
    seq: int | None
    status: str
    duration_ms: int | None
    peaks: list[float] | None
    delivery_status: str = "sent"
    created_at: datetime
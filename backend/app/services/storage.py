import uuid
from pathlib import Path

from app.config import settings


class StorageService:
    def __init__(self, root: str) -> None:
        self.root = Path(root).resolve()
        (self.root / "raw").mkdir(parents=True, exist_ok=True)
        (self.root / "processed").mkdir(parents=True, exist_ok=True)

    def save_raw(self, data: bytes) -> str:
        
        rel = f"raw/{uuid.uuid4().hex}.upload"
        (self.root / rel).write_bytes(data)
        return rel

    def full_path(self, rel: str) -> Path:
        path = (self.root / rel).resolve()
        if not path.is_relative_to(self.root):
            raise ValueError("invalid path")
        return path

    def delete(self, rel: str) -> None:
        self.full_path(rel).unlink(missing_ok=True)


storage = StorageService(settings.media_root)
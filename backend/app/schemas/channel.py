import re

from pydantic import field_validator

from app.schemas.base import CamelModel

NAME_RE = re.compile(r"^[a-z0-9_-]+( [a-z0-9_-]+)*$")


class CreateChannelRequest(CamelModel):
    name: str

    @field_validator("name")
    @classmethod
    def check_name(cls, v: str) -> str:
        v = re.sub(r"\s+", " ", v.strip()).lower()
        if not (2 <= len(v) <= 30) or not NAME_RE.fullmatch(v):
            raise ValueError("Channel name must be 2-30 characters: letters, numbers, spaces, - or _")
        return v


class ChannelOut(CamelModel):
    id: int
    name: str
    member_count: int
    is_member: bool
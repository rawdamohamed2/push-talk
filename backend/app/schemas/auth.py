import re

from pydantic import BaseModel, ConfigDict, field_validator

USERNAME_RE = re.compile(r"^[a-z0-9_]{3,30}$")


class SignupRequest(BaseModel):
    username: str
    password: str

    @field_validator("username")
    @classmethod
    def check_username(cls, v: str) -> str:
        v = v.strip().lower()
        if not USERNAME_RE.fullmatch(v):
            raise ValueError("Username must be 3-30 characters: letters, numbers or underscore")
        return v

    @field_validator("password")
    @classmethod
    def check_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password needs a lowercase letter")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password needs an uppercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password needs a number")
        if not re.search(r"[^A-Za-z0-9]", v):
            raise ValueError("Password needs a special character")
        return v


class LoginRequest(BaseModel):
    username: str
    password: str

    @field_validator("username")
    @classmethod
    def normalize(cls, v: str) -> str:
        return v.strip().lower()


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str


class AuthResponse(BaseModel):
    token: str
    user: UserOut
import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.db import get_db
from app.errors import AppError
from app.models import User
from app.security import decode_token

_bearer = HTTPBearer(auto_error=False)


def current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: Session = Depends(get_db),
) -> User:
    if creds is None:
        raise AppError(401, "not_authenticated", "Authentication required")
    try:
        user_id = decode_token(creds.credentials)
    except jwt.PyJWTError:
        raise AppError(401, "invalid_token", "Invalid or expired token") from None
    user = db.get(User, user_id)
    if user is None:
        raise AppError(401, "invalid_token", "Invalid or expired token")
    return user
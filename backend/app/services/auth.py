from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.errors import AppError
from app.models import User
from app.security import hash_password, verify_password

import logging
logger = logging.getLogger("pushtalk.auth")

def signup(db: Session, username: str, password: str) -> User:
    user = User(username=username, password_hash=hash_password(password))
    db.add(user)
    try:
        db.commit()
        logger.info("user_signed_up", extra={"user_id": user.id})
    except IntegrityError:
        db.rollback()
        raise AppError(409, "username_taken", "This username is already taken") from None
    return user


def login(db: Session, username: str, password: str) -> User:
    user = db.scalar(select(User).where(User.username == username))
    if user is None or not verify_password(password, user.password_hash):
        raise AppError(401, "invalid_credentials", "Invalid username or password")
    return user
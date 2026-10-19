from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.auth import AuthResponse, LoginRequest, SignupRequest
from app.security import create_token
from app.services import auth as auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse, status_code=201)
def signup(body: SignupRequest, db: Session = Depends(get_db)) -> AuthResponse:
    user = auth_service.signup(db, body.username, body.password)
    return AuthResponse(token=create_token(user.id), user=user)


@router.post("/login", response_model=AuthResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)) -> AuthResponse:
    user = auth_service.login(db, body.username, body.password)
    return AuthResponse(token=create_token(user.id), user=user)
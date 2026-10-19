from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    redis_url: str
    jwt_secret: str
    media_root: str = "/media"
    jwt_expire_minutes: int = 60 * 24
    cors_origins: str = "http://localhost:5173"

settings = Settings()
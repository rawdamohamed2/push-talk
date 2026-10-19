from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    redis_url: str
    jwt_secret: str
    media_root: str = "/media"
    jwt_expire_minutes: int = 60 * 24
    cors_origins: str = "http://localhost:5173"
    max_upload_bytes: int = 3_000_000
    min_duration_ms: int = 450
    max_duration_ms: int = 60_500

settings = Settings()
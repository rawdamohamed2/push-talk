from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    redis_url: str
    jwt_secret: str
    media_root: str = "/media"

settings = Settings()
from redis import Redis
from rq import Queue

from app.config import settings

audio_queue = Queue("audio", connection=Redis.from_url(settings.redis_url))
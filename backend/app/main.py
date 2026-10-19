from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.errors import register_error_handlers
from app.routers import auth, channels, messages, ws

app = FastAPI(title="PushTalk API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",")],
    allow_methods=["*"],
    allow_headers=["*"],
)

register_error_handlers(app)
app.include_router(auth.router)
app.include_router(channels.router)
app.include_router(messages.router)
app.include_router(ws.router)

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
import asyncio
import json
import logging

from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect
from fastapi.concurrency import run_in_threadpool
from redis.asyncio import Redis
from redis.asyncio.client import PubSub

from app.config import settings
from app.services import realtime

router = APIRouter()
logger = logging.getLogger("pushtalk.ws")


async def _forward_events(ws: WebSocket, redis: Redis, pubsub: PubSub, channel_id: int, user_id: int) -> None:
    async for item in pubsub.listen():
        if item["type"] != "message":
            continue
        event = json.loads(item["data"])
        sender_id = event.get("message", {}).get("senderId")

        if event["type"] == "message.failed" and sender_id != user_id:
            continue
        await ws.send_json(event)

        if event["type"] == "message.new" and sender_id != user_id:
            status = await run_in_threadpool(
                realtime.record_delivered, event["message"]["id"], channel_id, user_id
            )
            if status:
                await realtime.publish(redis, channel_id, {
                    "type": "receipt.update",
                    "messageId": event["message"]["id"],
                    "deliveryStatus": status,
                })


async def _handle_client_event(redis: Redis, event: object, channel_id: int, user_id: int) -> None:
    if not isinstance(event, dict) or event.get("type") != "message.played":
        return  
    message_id = event.get("messageId")
    if not isinstance(message_id, int):
        return
    status = await run_in_threadpool(realtime.record_played, message_id, channel_id, user_id)
    if status:
        await realtime.publish(redis, channel_id, {
            "type": "receipt.update", "messageId": message_id, "deliveryStatus": status,
        })


@router.websocket("/ws/channels/{channel_id}")
async def channel_socket(ws: WebSocket, channel_id: int, token: str = Query("")) -> None:
    await ws.accept()
    try:
        user_id = await run_in_threadpool(realtime.authorize_socket, token, channel_id)
    except realtime.SocketAuthError as exc:
        await ws.close(code=exc.code)
        return

    redis = Redis.from_url(settings.redis_url, decode_responses=True)
    pubsub = redis.pubsub()
    await pubsub.subscribe(realtime.event_channel(channel_id))  

    if await realtime.mark_online(redis, channel_id, user_id):
        await realtime.publish(redis, channel_id, {"type": "presence.update", "userId": user_id, "online": True})
    await ws.send_json({"type": "presence.snapshot", "userIds": await realtime.online_ids(redis, channel_id)})
    logger.info("ws_connected", extra={"user_id": user_id, "channel_id": channel_id})

    forwarder = asyncio.create_task(_forward_events(ws, redis, pubsub, channel_id, user_id))
    try:
        while True:
            try:
                event = await ws.receive_json()
            except json.JSONDecodeError:
                continue
            await _handle_client_event(redis, event, channel_id, user_id)
    except WebSocketDisconnect:
        pass
    finally:
        forwarder.cancel()
        await asyncio.gather(forwarder, return_exceptions=True)
        await pubsub.unsubscribe()
        await pubsub.aclose()
        if await realtime.mark_offline(redis, channel_id, user_id):
            await realtime.publish(redis, channel_id, {"type": "presence.update", "userId": user_id, "online": False})
        await redis.aclose()
        logger.info("ws_disconnected", extra={"user_id": user_id, "channel_id": channel_id})
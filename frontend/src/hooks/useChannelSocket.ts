import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getMessages } from "@/api/messages.ts";
import { authStorage } from "@/lib/authStorage.ts";
import { ChannelSocket } from "@/lib/socket.ts";
import {
  lastSeq,
  patchDelivery,
  upsertMany,
  upsertMessage,
  type MessagePages,
} from "@/lib/messageCache.ts";
import { messageKeys } from "@/hooks/queries/useMessages.ts";
import type { Message } from "@/types/index.ts";
import type { ConnectionStatus, ServerEvent } from "@/types/socket.type.ts";

const WS_URL: string = import.meta.env.VITE_WS_URL!;
const CATCH_UP_LIMIT = 100;

export function useChannelSocket(
  channelId: number,
  enabled: boolean,
  onLiveMessage: (message: Message) => void,
) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [onlineIds, setOnlineIds] = useState<number[]>([]);
  const socketRef = useRef<ChannelSocket | null>(null);

  const liveRef = useRef(onLiveMessage);
  useEffect(() => {
    liveRef.current = onLiveMessage;
  });

  useEffect(() => {
    if (!enabled) return;
    const token = authStorage.get()?.token;
    if (!token) return;

    const key = messageKeys.list(channelId);
    const update = (
      fn: (old: MessagePages | undefined) => MessagePages | undefined,
    ) => queryClient.setQueryData<MessagePages>(key, fn);

    const catchUp = async () => {
      let cursor = lastSeq(queryClient.getQueryData<MessagePages>(key));
      for (;;) {
        const batch = await getMessages(channelId, {
          afterSeq: cursor,
          limit: CATCH_UP_LIMIT,
        });
        if (batch.length === 0) return;
        update((old) => upsertMany(old, batch));
        const next = batch.at(-1)?.seq ?? cursor;
        if (batch.length < CATCH_UP_LIMIT || next === cursor) return;
        cursor = next;
      }
    };

    const handleEvent = (event: ServerEvent) => {
      switch (event.type) {
        case "presence.snapshot":
          setOnlineIds(event.userIds);
          break;
        case "presence.update":
          setOnlineIds((ids) =>
            event.online
              ? ids.includes(event.userId)
                ? ids
                : [...ids, event.userId]
              : ids.filter((id) => id !== event.userId),
          );
          break;
        case "message.new":
          update((old) => upsertMessage(old, event.message));
          liveRef.current(event.message);
          break;
        case "message.failed":
          update((old) => upsertMessage(old, event.message));
          break;
        case "receipt.update":
          update((old) =>
            patchDelivery(old, event.messageId, event.deliveryStatus),
          );
          break;
      }
    };

    const socket = new ChannelSocket({
      url: `${WS_URL}/ws/channels/${channelId}?token=${encodeURIComponent(token)}`,
      onEvent: handleEvent,
      onStatus: setStatus,
      onOpen: () => {
        catchUp().catch(() => undefined);
      },
    });
    socketRef.current = socket;
    socket.connect();

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setOnlineIds([]);
    };
  }, [channelId, enabled, queryClient]);

  const sendPlayed = useCallback((messageId: number) => {
    socketRef.current?.send({ type: "message.played", messageId });
  }, []);

  return { status, onlineIds, sendPlayed };
}

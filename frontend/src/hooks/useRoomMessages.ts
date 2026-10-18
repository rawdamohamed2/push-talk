import { useCallback, useMemo, useRef, useState } from "react";
import type { Message, User } from "@/types/index.ts";
import { getMockHistory, makePeaks, mockUsers } from "@/mocks/data.ts";

const PAGE_SIZE = 20;
const FAKE_LATENCY_MS = 600;

export function useRoomMessages(channelId: number) {
  const [history] = useState(() => getMockHistory(channelId));
  const [startIndex, setStartIndex] = useState(
    Math.max(0, history.length - PAGE_SIZE),
  );
  const [live, setLive] = useState<Message[]>([]);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const lastSeqRef = useRef(history.at(-1)?.seq ?? 0);

  const messages = useMemo(
    () => [...history.slice(startIndex), ...live],
    [history, startIndex, live],
  );
  const hasMore = startIndex > 0;

  const loadOlder = useCallback(() => {
    if (isLoadingOlder || !hasMore) return;
    setIsLoadingOlder(true);
    window.setTimeout(() => {
      setStartIndex((i) => Math.max(0, i - PAGE_SIZE));
      setIsLoadingOlder(false);
    }, FAKE_LATENCY_MS);
  }, [isLoadingOlder, hasMore]);

  const addMessage = useCallback((m: Message) => {
    setLive((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
  }, []);

  const updateMessage = useCallback((id: number, patch: Partial<Message>) => {
    setLive((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }, []);

  const makeMessage = useCallback(
    (
      sender: User,
      status: Message["status"],
      durationMs: number | null,
    ): Message => {
      lastSeqRef.current += 1;
      const seq = lastSeqRef.current;
      return {
        id: Date.now() + seq,
        channelId,
        senderId: sender.id,
        senderName: sender.username,
        seq,
        status,
        durationMs,
        peaks: durationMs ? makePeaks(seq) : null,
        deliveryStatus: "sent",
        createdAt: new Date().toISOString(),
      };
    },
    [channelId],
  );
  const addMockIncoming = useCallback(() => {
    const m = makeMessage(mockUsers[1], "sent", 3000);
    addMessage(m);
    return m;
  }, [makeMessage, addMessage]);

  const sendMockVoice = useCallback(
    (sender: User, durationMs: number) => {
      const m = makeMessage(sender, "processing", null);
      addMessage(m);
      window.setTimeout(
        () =>
          updateMessage(m.id, {
            status: "sent",
            durationMs,
            peaks: makePeaks(m.seq),
          }),
        1500,
      );
    },
    [makeMessage, addMessage, updateMessage],
  );

  return {
    messages,
    hasMore,
    isLoadingOlder,
    loadOlder,
    addMessage,
    addMockIncoming,
    sendMockVoice,
  };
}

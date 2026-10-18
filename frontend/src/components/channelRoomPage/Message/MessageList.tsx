import type { Message } from "@/types";
import MessageItem from "@/components/channelRoomPage/Message/MessageItem.tsx";
import { useLayoutEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import MessageEmpty from "@/components/channelRoomPage/Message/MessageEmpty.tsx";

const TOP_THRESHOLD_PX = 80;
interface MessageListProps {
  messages: Message[];
  currentUserId: number;
  playingId: number | null;
  isPaused: boolean;
  progress: number;
  hasMore: boolean;
  isLoadingOlder: boolean;
  onLoadOlder: () => void;
  onTogglePlay: (message: Message) => void;
}

const MessageList = ({
  messages,
  currentUserId,
  playingId,
  isPaused,
  progress,
  hasMore,
  isLoadingOlder,
  onLoadOlder,
  onTogglePlay,
}: MessageListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heightBeforeLoadRef = useRef<number | null>(null);
  const lastIdRef = useRef<number | null>(null);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el || isLoadingOlder || !hasMore) return;
    if (el.scrollTop < TOP_THRESHOLD_PX) {
      heightBeforeLoadRef.current = el.scrollHeight;
      onLoadOlder();
    }
  };

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (heightBeforeLoadRef.current !== null) {
      el.scrollTop = el.scrollHeight - heightBeforeLoadRef.current;
      heightBeforeLoadRef.current = null;
      return;
    }

    const lastId = messages.at(-1)?.id ?? null;
    if (lastId !== lastIdRef.current) {
      lastIdRef.current = lastId;
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return <MessageEmpty />;
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      {isLoadingOlder && messages.length !== 0 && (
        <div
          className="absolute inset-x-0 top-2 z-10 flex justify-center"
          role="status"
        >
          <span className="flex items-center gap-2 rounded-full bg-card px-3 py-1 text-xs text-muted-foreground shadow">
            <Loader2 className="size-3.5 animate-spin" /> Loading older
            messages...
          </span>
        </div>
      )}

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex h-full flex-col gap-4 overflow-y-auto p-4"
      >
        {messages.map((m) => (
          <MessageItem
            key={m.id}
            message={m}
            isMine={m.senderId === currentUserId}
            isPlaying={playingId === m.id}
            isPaused={isPaused}
            progress={playingId === m.id ? progress : 0}
            onTogglePlay={onTogglePlay}
          />
        ))}
      </div>
    </div>
  );
};
export default MessageList;

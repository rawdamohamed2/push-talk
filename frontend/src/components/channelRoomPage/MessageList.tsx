import { useEffect, useRef } from "react";
import type { Message } from "@/types/index.ts";
import MessageItem from "@/components/channelRoomPage/MessageItem.tsx";

interface MessageListProps {
  messages: Message[];
  currentUserId: number;
  playingId: number | null;
  progress?: number;
}
const MessageList = ({
  messages,
  currentUserId,
  playingId,
  progress,
}: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <section className="min-h-[500px] flex flex-1 items-center justify-center md:text-4xl text-3xl text-center text-muted-foreground">
        <p>No messages yet. Hold the button and say hello.</p>
      </section>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      {messages.map((m) => (
        <MessageItem
          key={m.id}
          message={m}
          isMine={m.senderId === currentUserId}
          isPlaying={playingId === m.id}
          progress={m.id === playingId ? progress : 0}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
export default MessageList;

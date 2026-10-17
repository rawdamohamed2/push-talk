import { memo } from "react";
import { AlertCircle, Loader2, Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils.ts";
import type { Message } from "@/types/index.ts";
import Waveform from "@/components/channelRoomPage/Waveform.tsx";
import StatusIcon from "@/components/channelRoomPage/StatusIcon.tsx";
import { formatDuration, formatTime } from "@/lib/format.ts";
import { Button } from "@/components/ui/button.tsx";

interface MessageItemProps {
  message: Message;
  isMine: boolean;
  isPlaying: boolean;
  progress?: number;
}

const MessageItem = memo(
  ({ message, isMine, isPlaying, progress = 0 }: MessageItemProps) => {
    const { status, peaks, durationMs, senderName, createdAt, deliveryStatus } =
      message;
    const idleColor = isMine
      ? "bg-on-primary-fixed-variant/60 text-primary-fixed"
      : "bg-border text-muted-foreground";
    const playingColor = isMine
      ? "bg-on-primary-container text-primary-fixed"
      : "bg-secondary";
    return (
      <div
        className={cn(
          "flex w-full flex-col ",
          isMine ? "items-end" : "items-start",
        )}
      >
        <div className={`flex flex-col gap-1`}>
          <div className=" flex items-center gap-2 text-muted-foreground">
            <span className="font-semibold text-base tracking-[-0.08px] leading-[24px] text-foreground">
              {isMine ? "You" : senderName}
            </span>
            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.4px] leading-[12px]`}
            >
              {formatTime(createdAt)}
            </span>
          </div>

          <div
            className={cn(
              "flex w-full max-w-md items-center gap-3 rounded-xl p-3",
              isMine ? "bg-primary-container" : "bg-popover/30",
              isPlaying && "border border-primary",
              status === "failed" && "text-on-error bg-error",
            )}
          >
            {status === "processing" && (
              <>
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Processing...
                </span>
              </>
            )}

            {status === "failed" && (
              <div className={`flex items-center gap-2`}>
                <AlertCircle className="size-5 text-destructive" />
                <p className={`flex flex-col`}>
                  <span className="text-sm text-destructive">
                    Failed to send
                  </span>
                  <span className={`text-[11px] text-error-container/70`}>
                    Network latency spike exceed 450ms
                  </span>
                </p>
              </div>
            )}

            {status === "sent" && peaks && durationMs !== null && (
              <>
                <Button
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground",
                    `${isPlaying ? playingColor : idleColor}`,
                  )}
                >
                  {isPlaying ? (
                    <Pause className="size-4" />
                  ) : (
                    <Play className="size-4" />
                  )}
                </Button>
                <Waveform
                  peaks={peaks}
                  progress={isPlaying ? progress : 0}
                  isMine={isMine}
                />
                <span className="font-mono text-xs text-muted-foreground">
                  {formatDuration(durationMs)}
                </span>
              </>
            )}
          </div>

          {isMine && status === "sent" && (
            <StatusIcon status={deliveryStatus} />
          )}
        </div>
      </div>
    );
  },
);
export default MessageItem;

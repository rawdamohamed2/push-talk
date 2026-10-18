import { Mic } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { MAX_DURATION_MS, type RecorderState } from "@/hooks/useRecorder.ts";
import { formatDuration } from "@/lib/format.ts";

interface PushToTalkButtonProps {
  state: RecorderState;
  elapsedMs: number;
  onStart: () => void;
  onStop: () => void;
}

export function PushToTalkButton({
  state,
  elapsedMs,
  onStart,
  onStop,
}: PushToTalkButtonProps) {
  const recording = state === "recording";

  return (
    <div
      className="
      flex flex-col items-center gap-2 p-4
      bg-linear-to-t from-muted to-background to-100%
    "
    >
      <div className="h-5 text-sm my-2" role="status" aria-live="polite">
        {recording && (
          <span className="font-mono text-destructive-foreground">
            {formatDuration(elapsedMs)} / {formatDuration(MAX_DURATION_MS)}
          </span>
        )}
        {state === "tooShort" && (
          <span className="text-amber-400">Too short, hold longer</span>
        )}
      </div>

      <button
        type="button"
        aria-label="Hold to talk"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          onStart();
        }}
        onPointerUp={onStop}
        onPointerCancel={onStop}
        onContextMenu={(e) => e.preventDefault()}
        className={cn(
          "flex size-24 touch-none select-none items-center justify-center rounded-full transition-all",
          recording
            ? "scale-105 bg-red-500 text-white shadow-[0_0_0_8px_rgba(239,68,68,0.25)]"
            : " bg-secondary text-secondary-foreground animate-fade hover:bg-secondary/80 border-0 ",
        )}
      >
        <Mic className="size-9" />
      </button>

      <p className="text-xs text-muted-foreground">
        {recording ? "Incoming messages paused while you talk" : "Hold to talk"}
      </p>
    </div>
  );
}

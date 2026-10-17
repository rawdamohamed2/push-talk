import { cn } from "@/lib/utils.ts";

interface WaveformProps {
  peaks: number[];
  progress?: number;
  className?: string;
  isMine: boolean;
}

const Waveform = ({
  peaks,
  progress = 0,
  className,
  isMine,
}: WaveformProps) => {
  const idleColor = isMine ? "bg-primary" : "bg-outline/50";
  const playingColor = isMine ? "bg-on-primary-container/90 " : "bg-secondary";
  return (
    <div
      className={cn("flex h-8 flex-1 items-center gap-0.5 ", className)}
      aria-hidden
    >
      {peaks.map((peak, i) => (
        <span
          key={i}
          className={cn(
            "w-1 rounded-full transition-colors ",
            i / peaks.length < progress ? playingColor : idleColor,
          )}
          style={{ height: `${Math.max(peak * 100, 10)}%` }}
        />
      ))}
    </div>
  );
};
export default Waveform;

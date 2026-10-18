import { ShieldCheck, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

interface EnableAudioOverlayProps {
  onEnable: () => void;
  onKeepMuted: () => void;
}
const EnableAudioOverlay = ({
  onEnable,
  onKeepMuted,
}: EnableAudioOverlayProps) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="enable-audio-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border bg-card px-8 py-10 text-center shadow-2xl">
        <div className="pointer-events-none absolute -left-16 -top-16 size-64 rounded-full bg-secondary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-16 size-64 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative">
          <div className="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-background shadow-[0_0_32px_rgba(192,193,255,0.45)] ring-1 ring-primary/40">
            <Volume2 className="size-10 text-secondary" />
          </div>

          <h2 id="enable-audio-title" className="text-2xl font-semibold">
            Enable voice audio
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
            Your browser requires user interaction before incoming voice
            messages and live room audio can play automatically.
          </p>

          <Button
            size="lg"
            className="mt-8 w-full gap-2 shadow-lg shadow-primary/30"
            onClick={onEnable}
          >
            <Volume2 className="size-4" />
            Enable Audio
          </Button>

          <button
            type="button"
            onClick={onKeepMuted}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <VolumeX className="size-4" />
            Keep muted for now
          </button>

          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-secondary" />
            No microphone access required to listen
          </p>
        </div>
      </div>
    </div>
  );
};
export default EnableAudioOverlay;

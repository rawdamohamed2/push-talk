import type { AudioPlayer, QueuedMessage } from "@/types/playQueue.type.ts";
type OnProgress = (progress: number) => void;

type FetchAudio = (messageId: number) => Promise<Blob>;

export class BrowserAudioPlayer implements AudioPlayer {
  private readonly fetchAudio: FetchAudio;
  private readonly onProgress?: OnProgress;
  private current: HTMLAudioElement | null = null;
  private finishCurrent: (() => void) | null = null;

  constructor(fetchAudio: FetchAudio, onProgress?: OnProgress) {
    this.fetchAudio = fetchAudio;
    this.onProgress = onProgress;
  }

  async play(message: QueuedMessage): Promise<void> {
    const blob = await this.fetchAudio(message.id);
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    this.current = audio;

    audio.ontimeupdate = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        this.onProgress?.(audio.currentTime / audio.duration);
      }
    };

    try {
      await new Promise<void>((resolve, reject) => {
        this.finishCurrent = resolve;
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error("audio playback failed"));
        audio.play().catch(reject);
      });
    } finally {
      URL.revokeObjectURL(url);
      this.current = null;
      this.finishCurrent = null;
      this.onProgress?.(0);
    }
  }

  pause(): void {
    this.current?.pause();
  }

  resume(): void {
    void this.current?.play();
  }

  stop(): void {
    this.current?.pause();
    this.finishCurrent?.();
  }
}

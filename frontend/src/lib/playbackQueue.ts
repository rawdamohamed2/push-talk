import type { Options, QueuedMessage } from "@/types/playQueue.type.ts";

export class PlaybackQueue {
    private pending: QueuedMessage[] = [];
    private seen = new Set<number>();
    private isPlaying = false;
    private isPaused = false;
    private playingId: number | null = null;
    private readonly options: Options;
    private isManuallyPaused = false;
    private nextManual: QueuedMessage | null = null;

    constructor(options: Options) {
        this.options = options;
    }

  enqueue(message: QueuedMessage): void {
    if (message.senderId === this.options.currentUserId) return;
    if (this.seen.has(message.id)) return;
    this.seen.add(message.id);

    this.pending.push(message);
    this.pending.sort((a, b) => a.seq! - b.seq!);
    this.emit();
    void this.playNext();
  }

  pause(): void {
    this.isPaused = true;
    if (this.isPlaying) this.options.player.pause();
  }

  resume(): void {
    this.isPaused = false;
    if (this.isPlaying) {
      if (!this.isManuallyPaused) {
        this.options.player.resume();
      }
    } else {
      void this.playNext();
    }
  }

  clear(): void {
    this.pending = [];
    this.nextManual = null;
    this.emit();
  }

  toggle(message: QueuedMessage): void {
    if (this.playingId === message.id) {
      if (this.isManuallyPaused) {
        this.isManuallyPaused = false;
        this.options.player.resume();
      } else {
        this.isManuallyPaused = true;
        this.options.player.pause();
      }
      this.emit();
      return;
    }
    this.playNow(message);
  }

  playFrom(message: QueuedMessage, following: QueuedMessage[]): void {
    this.pending = following
      .filter(
        (m) =>
          m.seq! > message.seq! && m.senderId !== this.options.currentUserId,
      )
      .sort((a, b) => a.seq! - b.seq!);
    this.pending.forEach((m) => this.seen.add(m.id));
    this.seen.add(message.id);
    this.nextManual = message;
    if (this.isPlaying) this.options.player.stop();
    else void this.playNext();
  }

  private playNow(message: QueuedMessage): void {
    this.pending = this.pending.filter((m) => m.id !== message.id);
    this.seen.add(message.id);
    this.nextManual = message;
    if (this.isPlaying) this.options.player.stop();
    else void this.playNext();
  }

  get size(): number {
    return this.pending.length;
  }

  private async playNext(): Promise<void> {
    if (this.isPlaying || this.isPaused) return;
    const next = this.nextManual ?? this.pending.shift();
    this.nextManual = null;
    if (!next) return;

    this.isPlaying = true;
    this.playingId = next.id;
    this.emit();
    try {
      await this.options.player.play(next);
      this.options.onPlayed?.(next);
    } catch (error) {
      this.options.onError?.(next, error);
    } finally {
      this.isPlaying = false;
      this.playingId = null;
      this.isManuallyPaused = false;
      this.emit();
    }
    void this.playNext();
  }

  private emit(): void {
    this.options.onChange?.({
      playingId: this.playingId,
      waiting: this.pending.length,
      paused: this.isManuallyPaused,
    });
  }
}

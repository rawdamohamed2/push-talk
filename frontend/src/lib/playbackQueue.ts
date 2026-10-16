import type {Options, QueuedMessage} from "@/types/playQueue.type.ts";

export class PlaybackQueue {
    private pending: QueuedMessage[] = [];
    private seen = new Set<number>();
    private isPlaying = false;
    private isPaused = false;
    private playingId: number | null = null;
    private readonly options: Options;


    constructor(options: Options) {
        this.options = options;
    }

    enqueue(message: QueuedMessage): void {
        if (message.senderId === this.options.currentUserId) return;
        if (this.seen.has(message.id)) return;
        this.seen.add(message.id);

        this.pending.push(message);
        this.pending.sort((a, b) => a.seq - b.seq);
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
            this.options.player.resume();
        } else {
            void this.playNext();
        }
    }

    clear(): void {
        this.pending = [];
        this.emit();
    }

    get size(): number {
        return this.pending.length;
    }

    private async playNext(): Promise<void> {
        if (this.isPlaying || this.isPaused) return;
        const next = this.pending.shift();
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
            this.emit();
        }
        void this.playNext();
    }

    private emit(): void {
        this.options.onChange?.({
            playingId: this.playingId,
            waiting: this.pending.length,
        });
    }
}
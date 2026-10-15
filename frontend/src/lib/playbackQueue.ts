import type { Message } from "../types";

export type QueuedMessage = Pick<Message, "id" | "seq" | "senderId">;

export interface AudioPlayer {
    play(message: QueuedMessage): Promise<void>;
}

interface Options {
    currentUserId: number;
    player: AudioPlayer;
    onPlayed?: (message: QueuedMessage) => void;
    onError?: (message: QueuedMessage, error: unknown) => void;
}
export class PlaybackQueue {
    private pending: QueuedMessage[] = [];
    private seen = new Set<number>();
    private isPlaying = false;
    private isPaused = false;

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
        void this.playNext();
    }

    pause(): void {
        this.isPaused = true;
    }

    resume(): void {
        this.isPaused = false;
        void this.playNext();
    }

    get size(): number {
        return this.pending.length;
    }

    private async playNext(): Promise<void> {
        if (this.isPlaying || this.isPaused) return;
        const next = this.pending.shift();
        if (!next) return;

        this.isPlaying = true;
        try {
            await this.options.player.play(next);
            this.options.onPlayed?.(next);
        } catch (error) {
            this.options.onError?.(next, error);
        } finally {
            this.isPlaying = false;
        }
        void this.playNext();
    }
}
import type {Message} from "@/types/index.ts";

export type QueuedMessage = Pick<Message, "id" | "seq" | "senderId">;

export interface QueueState {
    playingId: number | null;
    waiting: number;
}

export interface AudioPlayer {
    play(message: QueuedMessage): Promise<void>;
    pause(): void;
    resume(): void;
}

export interface Options {
    currentUserId: number;
    player: AudioPlayer;
    onPlayed?: (message: QueuedMessage) => void;
    onError?: (message: QueuedMessage, error: unknown) => void;
    onChange?: (state: QueueState) => void;
}
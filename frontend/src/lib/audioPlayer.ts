import type {AudioPlayer, QueuedMessage} from "@/types/playQueue.type.ts";


type FetchAudio = (messageId: number) => Promise<Blob>;

export class BrowserAudioPlayer implements AudioPlayer {
    private readonly fetchAudio: FetchAudio;
    private current: HTMLAudioElement | null = null;

    constructor(fetchAudio: FetchAudio) {
        this.fetchAudio = fetchAudio;
    }

    private paused = false;

    pause(): void {
        this.paused = true;
        this.current?.pause();
    }

    resume(): void {
        this.paused = false;
        void this.current?.play();
    }

    async play(message: QueuedMessage): Promise<void> {
        const blob = await this.fetchAudio(message.id);
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        this.current = audio;

        try {
            await new Promise<void>((resolve, reject) => {
                audio.onended = () => resolve();
                audio.onerror = () => reject(new Error("audio playback failed"));
                if (!this.paused) audio.play().catch(reject); // مايبدأش لو paused
            });
        } finally {
            URL.revokeObjectURL(url);
            this.current = null;
        }
    }
}
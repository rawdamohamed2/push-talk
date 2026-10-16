import { describe, it, expect, vi } from "vitest";
import {PlaybackQueue} from "@/lib/playbackQueue.ts";
import type {QueuedMessage} from "@/types/playQueue.type.ts";


const ME = 1;
const msg = (id: number, seq = id, senderId = 2): QueuedMessage => ({ id, seq, senderId });
const flush = () => new Promise((r) => setTimeout(r, 0));

function createFakePlayer() {
    const played: number[] = [];
    const resolvers: Array<() => void> = [];
    const rejecters: Array<(e: Error) => void> = [];
    return {
        played,
        play: (m: QueuedMessage) => {
            played.push(m.id);
            return new Promise<void>((res, rej) => {
                resolvers.push(res);
                rejecters.push(rej);
            });
        },
        pause: vi.fn(),
        resume: vi.fn(),
        finishCurrent: () => {
            rejecters.shift();
            resolvers.shift()?.();
        },
        failCurrent: () => {
            resolvers.shift();
            rejecters.shift()?.(new Error("decode failed"));
        },
    };
}

function setup() {
    const player = createFakePlayer();
    const queue = new PlaybackQueue({ currentUserId: ME, player });
    return { player, queue };
}

describe("PlaybackQueue", () => {
    it("plays the first message immediately", () => {
        const { player, queue } = setup();
        queue.enqueue(msg(1));
        expect(player.played).toEqual([1]);
    });

    it("pauses the current audio when queue is paused", () => {
        const { player, queue } = setup();
        queue.enqueue(msg(1));
        queue.pause();
        expect(player.pause).toHaveBeenCalledTimes(1);
    });

    it("resumes the current audio instead of starting a new one", () => {
        const { player, queue } = setup();
        queue.enqueue(msg(1));
        queue.enqueue(msg(2));
        queue.pause();
        queue.resume();
        expect(player.resume).toHaveBeenCalledTimes(1);
        expect(player.played).toEqual([1]);
    });

    it("does not call player.pause when nothing is playing", () => {
        const { player, queue } = setup();
        queue.pause();
        expect(player.pause).not.toHaveBeenCalled();
    });

    it("never plays two messages at the same time", () => {
        const { player, queue } = setup();
        queue.enqueue(msg(1));
        queue.enqueue(msg(2));
        expect(player.played).toEqual([1]);
        expect(queue.size).toBe(1);
    });

    it("plays the next message after the current one ends", async () => {
        const { player, queue } = setup();
        queue.enqueue(msg(1));
        queue.enqueue(msg(2));
        player.finishCurrent();
        await flush();
        expect(player.played).toEqual([1, 2]);
    });
    it("reports playing id and waiting count through onChange", async () => {
        const onChange = vi.fn();
        const player = createFakePlayer();
        const queue = new PlaybackQueue({ currentUserId: ME, player, onChange });

        queue.enqueue(msg(1));
        queue.enqueue(msg(2));
        expect(onChange).toHaveBeenLastCalledWith({ playingId: 1, waiting: 1 });

        player.finishCurrent();
        await flush();
        expect(onChange).toHaveBeenLastCalledWith({ playingId: 2, waiting: 0 });
    });
    it("ignores my own messages", () => {
        const { player, queue } = setup();
        queue.enqueue(msg(1, 1, ME));
        expect(player.played).toEqual([]);
        expect(queue.size).toBe(0);
    });

    it("orders waiting messages by seq, not arrival time", async () => {
        const { player, queue } = setup();
        queue.enqueue(msg(1));
        queue.enqueue(msg(4));
        queue.enqueue(msg(2));
        queue.enqueue(msg(3));
        player.finishCurrent();
        await flush();
        player.finishCurrent();
        await flush();
        player.finishCurrent();
        await flush();
        expect(player.played).toEqual([1, 2, 3, 4]);
    });

    it("ignores duplicate messages", () => {
        const { player, queue } = setup();
        queue.enqueue(msg(1));
        queue.enqueue(msg(2));
        queue.enqueue(msg(2));
        expect(queue.size).toBe(1);
        expect(player.played).toEqual([1]);
    });

    it("does not start new messages while paused, and resumes later", () => {
        const { player, queue } = setup();
        queue.pause();
        queue.enqueue(msg(1));
        expect(player.played).toEqual([]);
        queue.resume();
        expect(player.played).toEqual([1]);
    });

    it("keeps going after a message fails to play", async () => {
        const onError = vi.fn();
        const player = createFakePlayer();
        const queue = new PlaybackQueue({ currentUserId: ME, player, onError });
        queue.enqueue(msg(1));
        queue.enqueue(msg(2));
        player.failCurrent();
        await flush();
        expect(onError).toHaveBeenCalledTimes(1);
        expect(player.played).toEqual([1, 2]);
    });

    it("calls onPlayed when a message finishes", async () => {
        const onPlayed = vi.fn();
        const player = createFakePlayer();
        const queue = new PlaybackQueue({ currentUserId: ME, player, onPlayed });
        queue.enqueue(msg(1));
        player.finishCurrent();
        await flush();
        expect(onPlayed).toHaveBeenCalledWith(msg(1));
    });
});
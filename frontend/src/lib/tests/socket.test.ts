import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChannelSocket, backoff } from "../socket.ts";

class FakeWebSocket {
  static OPEN = 1;
  static instances: FakeWebSocket[] = [];
  readyState = 0;
  readonly url: string;
  onopen: (() => void) | null = null;
  onclose: ((e: { code: number }) => void) | null = null;
  onmessage: ((e: { data: string }) => void) | null = null;
  send = vi.fn();
  close = vi.fn();

  constructor(url: string) {
    this.url = url;
    FakeWebSocket.instances.push(this);
  }
  open() {
    this.readyState = 1;
    this.onopen?.();
  }
  drop(code = 1006) {
    this.readyState = 3;
    this.onclose?.({ code });
  }
}

const count = () => FakeWebSocket.instances.length;
const last = () => FakeWebSocket.instances[count() - 1];

function setup() {
  const onStatus = vi.fn();
  const onOpen = vi.fn();
  const socket = new ChannelSocket({
    url: "ws://test",
    onEvent: vi.fn(),
    onStatus,
    onOpen,
  });
  socket.connect();
  return { socket, onStatus, onOpen };
}

describe("backoff", () => {
  it("doubles each attempt and stops at 30 seconds", () => {
    expect([0, 1, 2, 3].map(backoff)).toEqual([1000, 2000, 4000, 8000]);
    expect(backoff(10)).toBe(30_000);
  });
});

describe("ChannelSocket", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    FakeWebSocket.instances = [];
    vi.stubGlobal("WebSocket", FakeWebSocket);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("reconnects after an unexpected close, waiting longer each time", () => {
    setup();
    last().drop();
    vi.advanceTimersByTime(999);
    expect(count()).toBe(1);
    vi.advanceTimersByTime(1);
    expect(count()).toBe(2);

    last().drop();
    vi.advanceTimersByTime(1999);
    expect(count()).toBe(2);
    vi.advanceTimersByTime(1);
    expect(count()).toBe(3);
  });

  it("starts again from one second after a successful connection", () => {
    setup();
    last().drop();
    vi.advanceTimersByTime(1000);
    last().open();
    last().drop();
    vi.advanceTimersByTime(1000);
    expect(count()).toBe(3);
  });

  it.each([4401, 4403])("does not reconnect on close code %i", (code) => {
    const { onStatus } = setup();
    last().drop(code);
    vi.advanceTimersByTime(60_000);
    expect(count()).toBe(1);
    expect(onStatus).toHaveBeenLastCalledWith("closed");
  });

  it("does not reconnect after disconnect, even if a retry was scheduled", () => {
    const { socket } = setup();
    last().drop();
    socket.disconnect();
    vi.advanceTimersByTime(60_000);
    expect(count()).toBe(1);
  });

  it("calls onOpen every time the connection opens", () => {
    const { onOpen } = setup();
    last().open();
    last().drop();
    vi.advanceTimersByTime(1000);
    last().open();
    expect(onOpen).toHaveBeenCalledTimes(2);
  });

  it("does not send while the connection is not open", () => {
    const { socket } = setup();
    socket.send({ type: "message.played", messageId: 1 });
    expect(last().send).not.toHaveBeenCalled();
    last().open();
    socket.send({ type: "message.played", messageId: 1 });
    expect(last().send).toHaveBeenCalledTimes(1);
  });
});

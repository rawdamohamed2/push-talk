import type {
  ClientEvent,
  ConnectionStatus,
  ServerEvent,
} from "@/types/socket.type.ts";

const MAX_DELAY_MS = 30_000;
const FATAL_CLOSE_CODES = new Set([4401, 4403]);

export function backoff(attempt: number): number {
  return Math.min(1000 * 2 ** attempt, MAX_DELAY_MS);
}

interface Options {
  url: string;
  onEvent: (event: ServerEvent) => void;
  onStatus: (status: ConnectionStatus) => void;
  onOpen: () => void;
}

export class ChannelSocket {
  private readonly options: Options;
  private ws: WebSocket | null = null;
  private attempt = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private closedByUs = false;

  constructor(options: Options) {
    this.options = options;
  }

  connect(): void {
    this.closedByUs = false;
    this.options.onStatus("connecting");
    this.open();
  }

  disconnect(): void {
    this.closedByUs = true;
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
    const ws = this.ws;
    this.ws = null;
    if (ws) {
      ws.onopen = null;
      ws.onmessage = null;
      ws.onclose = null;
      ws.close();
    }
  }

  send(event: ClientEvent): void {
    if (this.ws?.readyState === WebSocket.OPEN)
      this.ws.send(JSON.stringify(event));
  }

  private open(): void {
    const ws = new WebSocket(this.options.url);
    this.ws = ws;

    ws.onopen = () => {
      this.attempt = 0;
      this.options.onStatus("connected");
      this.options.onOpen();
    };

    ws.onmessage = (e: MessageEvent<string>) => {
      try {
        this.options.onEvent(JSON.parse(e.data) as ServerEvent);
      } catch {
        console.error("error");
      }
    };

    ws.onclose = (e: CloseEvent) => {
      if (this.ws !== ws) return;
      this.ws = null;
      if (this.closedByUs) return;

      if (FATAL_CLOSE_CODES.has(e.code)) {
        this.options.onStatus("closed");
        return;
      }
      this.options.onStatus("reconnecting");
      this.timer = setTimeout(() => this.open(), backoff(this.attempt));
      this.attempt += 1;
    };
  }
}

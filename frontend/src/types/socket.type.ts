import type { DeliveryStatus, Message } from "@/types/index.ts";

export type ConnectionStatus =
  "connecting" | "connected" | "reconnecting" | "closed";

export type ServerEvent =
  | { type: "presence.snapshot"; userIds: number[] }
  | { type: "presence.update"; userId: number; online: boolean }
  | { type: "message.new"; message: Message }
  | { type: "message.failed"; message: Message }
  | {
      type: "receipt.update";
      messageId: number;
      deliveryStatus: DeliveryStatus;
    };

export type ClientEvent = { type: "message.played"; messageId: number };

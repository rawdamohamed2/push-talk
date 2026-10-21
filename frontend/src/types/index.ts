export interface User {
  id: number;
  username: string;
}
export interface Channel {
  id: number;
  name: string;
  memberCount: number;
  isMember: boolean;
}
export interface newChannel {
  name: string;
}
export type MessageStatus = "processing" | "sent" | "failed";
export type DeliveryStatus = "sent" | "delivered" | "played";

export interface Message {
  id: number;
  channelId: number;
  senderId: number;
  senderName: string;
  seq: number | null;
  status: MessageStatus;
  durationMs: number | null;
  peaks: number[] | null;
  deliveryStatus: DeliveryStatus;
  createdAt: string;
}

export type ConnectionStatus = "connected" | "reconnecting" | "offline";

export const STYLES: Record<
  ConnectionStatus,
  { label: string; dot: string; text: string }
> = {
  connected: {
    label: "Connected",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
  },
  reconnecting: {
    label: "Reconnecting...",
    dot: "bg-amber-400 animate-pulse",
    text: "text-amber-400",
  },
  offline: { label: "Offline", dot: "bg-red-400", text: "text-red-400" },
};

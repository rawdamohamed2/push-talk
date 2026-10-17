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
export type MessageStatus = "processing" | "sent" | "failed";
export type DeliveryStatus = "sent" | "delivered" | "played";

export interface Message {
  id: number;
  channelId: number;
  senderId: number;
  senderName: string;
  seq: number;
  status: MessageStatus;
  durationMs: number | null;
  peaks: number[] | null;
  deliveryStatus: DeliveryStatus;
  createdAt: string;
}

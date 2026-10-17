import type { Channel, Message, User } from "@/types/index.ts";

export const mockCurrentUser: User = { id: 1, username: "rawda" };

export const mockUsers: User[] = [
  mockCurrentUser,
  { id: 2, username: "sarah" },
  { id: 3, username: "marcus" },
  { id: 4, username: "elena" },
  { id: 5, username: "david" },
];

export const mockOnlineUserIds: number[] = [1, 2, 3, 4];

export const mockChannels: Channel[] = [
  { id: 1, name: "general", memberCount: 5, isMember: true },
  { id: 2, name: "team", memberCount: 3, isMember: true },
  { id: 3, name: "random", memberCount: 8, isMember: false },
  { id: 4, name: "design", memberCount: 2, isMember: false },
];

function makePeaks(seed: number, count = 32): number[] {
  return Array.from({ length: count }, (_, i) => {
    const v = Math.abs(Math.sin(seed * 12.9898 + i * 78.233));
    return Math.round((0.15 + v * 0.85) * 100) / 100;
  });
}

const base = new Date("2026-10-17T10:40:00Z").getTime();
const at = (minutes: number) => new Date(base + minutes * 60_000).toISOString();

export const mockMessages: Message[] = [
  {
    id: 1,
    channelId: 1,
    senderId: 2,
    senderName: "sarah",
    seq: 1,
    status: "sent",
    durationMs: 8000,
    peaks: makePeaks(1),
    deliveryStatus: "played",
    createdAt: at(0),
  },
  {
    id: 2,
    channelId: 1,
    senderId: 3,
    senderName: "marcus",
    seq: 2,
    status: "sent",
    durationMs: 5000,
    peaks: makePeaks(2),
    deliveryStatus: "sent",
    createdAt: at(1),
  },
  {
    id: 3,
    channelId: 1,
    senderId: 1,
    senderName: "rawda",
    seq: 3,
    status: "sent",
    durationMs: 11000,
    peaks: makePeaks(3),
    deliveryStatus: "played",
    createdAt: at(3),
  },
  {
    id: 4,
    channelId: 1,
    senderId: 1,
    senderName: "rawda",
    seq: 4,
    status: "sent",
    durationMs: 4000,
    peaks: makePeaks(4),
    deliveryStatus: "delivered",
    createdAt: at(4),
  },

  {
    id: 5,
    channelId: 1,
    senderId: 1,
    senderName: "rawda",
    seq: 5,
    status: "sent",
    durationMs: 2500,
    peaks: makePeaks(5),
    deliveryStatus: "sent",
    createdAt: at(5),
  },

  {
    id: 6,
    channelId: 1,
    senderId: 4,
    senderName: "elena",
    seq: 6,
    status: "sent",
    durationMs: 6500,
    peaks: makePeaks(6),
    deliveryStatus: "sent",
    createdAt: at(6),
  },
  {
    id: 7,
    channelId: 1,
    senderId: 1,
    senderName: "rawda",
    seq: 7,
    status: "processing",
    durationMs: null,
    peaks: null,
    deliveryStatus: "sent",
    createdAt: at(7),
  },
  {
    id: 8,
    channelId: 1,
    senderId: 1,
    senderName: "rawda",
    seq: 8,
    status: "failed",
    durationMs: null,
    peaks: null,
    deliveryStatus: "sent",
    createdAt: at(8),
  },
];

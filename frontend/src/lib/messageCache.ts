import type { InfiniteData } from "@tanstack/react-query";
import type { DeliveryStatus, Message } from "@/types/index.ts";
import type { QueuedMessage } from "@/types/playQueue.type.ts";

export type MessagePages = InfiniteData<Message[], number | undefined>;

export function compareMessages(a: Message, b: Message): number {
  if (a.seq === null && b.seq === null) return a.id - b.id;
  if (a.seq === null) return 1;
  if (b.seq === null) return -1;
  return a.seq - b.seq;
}

export function upsertMessage(
  data: MessagePages | undefined,
  message: Message,
): MessagePages {
  if (!data) return { pages: [[message]], pageParams: [undefined] };

  let found = false;
  const pages = data.pages.map((page) =>
    page.map((m) => {
      if (m.id !== message.id) return m;
      found = true;
      return message;
    }),
  );
  if (!found) pages[0] = [...pages[0], message];

  pages[0] = [...pages[0]].sort(compareMessages);
  return { ...data, pages };
}

export function upsertMany(
  data: MessagePages | undefined,
  messages: Message[],
): MessagePages {
  return (
    messages.reduce<MessagePages | undefined>(
      (acc, m) => upsertMessage(acc, m),
      data,
    ) ?? {
      pages: [[]],
      pageParams: [undefined],
    }
  );
}

export function lastSeq(data: MessagePages | undefined): number {
  return (data?.pages ?? [])
    .flat()
    .reduce((max, m) => (m.seq !== null && m.seq > max ? m.seq : max), 0);
}

export function toQueued(m: Message): QueuedMessage | null {
  return m.status === "sent" && m.seq !== null
    ? { id: m.id, seq: m.seq, senderId: m.senderId }
    : null;
}

export function hasMessage(
  data: MessagePages | undefined,
  id: number,
): boolean {
  return (data?.pages ?? []).some((page) => page.some((m) => m.id === id));
}

export function patchDelivery(
  data: MessagePages | undefined,
  messageId: number,
  deliveryStatus: DeliveryStatus,
): MessagePages | undefined {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map((page) =>
      page.map((m) => (m.id === messageId ? { ...m, deliveryStatus } : m)),
    ),
  };
}

import { request, requestBlob } from "./http.ts";
import type { Message, MessageStatus } from "@/types";

export interface HistoryParams {
  beforeSeq?: number;
  afterSeq?: number;
  limit?: number;
}
export const getMessages = (
  channelId: number,
  { beforeSeq, afterSeq, limit = 20 }: HistoryParams = {},
) => {
  const params = new URLSearchParams({ limit: String(limit) });
  if (beforeSeq !== undefined) params.set("before_seq", String(beforeSeq));
  if (afterSeq !== undefined) params.set("after_seq", String(afterSeq));
  return request<Message[]>(`/channels/${channelId}/messages?${params}`, {
    method: "GET",
  });
};

export const uploadMessage = (channelId: number, audio: Blob) => {
  const form = new FormData();
  form.append("audio", audio, "recording.webm");
  return request<{ id: number; status: MessageStatus }>(
    `/channels/${channelId}/messages`,
    {
      method: "POST",
      form: form,
    },
  );
};

export const fetchAudioBlob = (messageId: number) => {
  return requestBlob(`/messages/${messageId}/audio`);
};

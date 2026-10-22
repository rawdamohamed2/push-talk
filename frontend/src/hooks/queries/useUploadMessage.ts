import { uploadMessage } from "@/api/messages.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Message, User } from "@/types";
import {
  hasMessage,
  type MessagePages,
  upsertMessage,
} from "@/lib/messageCache.ts";
import { messageKeys } from "./useMessages";

export const UseUploadMessage = (channelId: number, me: User) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (audio: Blob) => uploadMessage(channelId, audio),
    onSuccess: ({ id }) => {
      const pending: Message = {
        id,
        channelId,
        senderId: me.id,
        senderName: me.username,
        seq: null,
        status: "processing",
        durationMs: null,
        peaks: null,
        deliveryStatus: "sent",
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData<MessagePages>(
        messageKeys.list(channelId),
        (old) => (hasMessage(old, id) ? old : upsertMessage(old, pending)),
      );
    },
  });
};

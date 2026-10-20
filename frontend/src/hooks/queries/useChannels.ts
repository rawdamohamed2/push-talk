import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createChannel,
  getChannel,
  getChannelMembers,
  getChannels,
  joinChannel,
} from "@/api/channels.ts";

export const channelKeys = {
  all: ["channels"] as const,
  detail: (id: number) => ["channel", id] as const,
  members: (id: number) => ["channel", id, "members"] as const,
};

export const useChannels = () => {
  return useQuery({
    queryKey: ["channels"],
    queryFn: getChannels,
  });
};

export const useChannelMembers = (id: number, enabled = true) =>
  useQuery({
    queryKey: channelKeys.members(id),
    queryFn: () => getChannelMembers(id),
    enabled: enabled && id > 0,
  });

export function useCreateChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createChannel,
    onSuccess: (channel) => {
      qc.setQueryData(channelKeys.detail(channel.id), channel);
      qc.invalidateQueries({ queryKey: channelKeys.all });
    },
  });
}

export function useJoinChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: joinChannel,
    onSuccess: (channel) => {
      qc.setQueryData(channelKeys.detail(channel.id), channel);
      qc.invalidateQueries({ queryKey: channelKeys.all });
      qc.invalidateQueries({ queryKey: channelKeys.members(channel.id) });
    },
  });
}

export const useGetChannels = (id: number, enabled = true) =>
  useQuery({
    queryKey: channelKeys.detail(id),
    queryFn: () => getChannel(id),
    enabled: enabled && id > 0,
  });

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createChannel,
  getChannelMembers,
  getChannels,
  joinChannel,
} from "@/api/channels.ts";

export const channelKeys = {
  all: ["channels"] as const,
  detail: (id: number) => ["channel", id] as const,
  members: (id: number) => ["channel", id, "members"] as const,
};

export const getChannelsQuery = () => {
  return useQuery({
    queryKey: ["channels"],
    queryFn: getChannels,
  });
};

export const createChannelMutation = () => {
  useMutation({
    mutationFn: createChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channels"],
      });
    },
  });
};

export const useChannel = (channel_id?: number) => {
  const joinChannelMutation = useMutation({
    mutationFn: joinChannel,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channels"],
      });
    },
  });

  const getChannelMembersQuery = useQuery({
    queryKey: ["channelMembers", channel_id],
    queryFn: () => getChannelMembers(channel_id!),
    enabled: channel_id !== undefined,
  });

  return {
    getChannelsQuery,
    createChannelMutation,
    joinChannelMutation,
    getChannelMembersQuery,
  };
};

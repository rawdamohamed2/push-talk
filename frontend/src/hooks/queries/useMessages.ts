import { useInfiniteQuery } from "@tanstack/react-query";
import { getMessages } from "@/api/messages.ts";
import type { Message } from "@/types";

const PAGE_SIZE = 20;

export const messageKeys = {
  list: (channelId: number) => ["messages", channelId] as const,
};

export const useMessages = (channelId: number, enabled: boolean) => {
  const query = useInfiniteQuery({
    queryKey: messageKeys.list(channelId),
    queryFn: ({ pageParam }) =>
      getMessages(channelId, { beforeSeq: pageParam, limit: PAGE_SIZE }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (oldestPage: Message[]) =>
      oldestPage.length < PAGE_SIZE
        ? undefined
        : (oldestPage[0]?.seq ?? undefined),
    enabled,
    staleTime: Infinity,
  });
  const messages = (query.data?.pages ?? []).slice().reverse().flat();
  return {
    messages,
    isSuccess: query.isSuccess,
    hasMore: query.hasNextPage,
    isLoadingOlder: query.isFetchingNextPage,
    loadOlder: () => void query.fetchNextPage(),
    isLoading: query.isLoading,
    error: query.error,
  };
};

import { useMemo } from "react";
import type { Channel } from "@/types";

interface UseSearchParams {
  channels: Channel[];
  query: string;
}

export const useSearch = ({ channels, query }: UseSearchParams) => {
  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return channels.filter((channel) =>
      channel.name.toLowerCase().includes(normalizedQuery),
    );
  }, [channels, query]);

  return visible;
};

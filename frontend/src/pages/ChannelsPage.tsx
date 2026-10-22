import ChannelSection from "@/components/channelsPage/ChannelSection.tsx";
import { SearchInput } from "@/components/channelsPage/SearchInput.tsx";
import { useState } from "react";
import NewChannelDialog from "@/components/channelsPage/NewChannelDialog.tsx";
import ChannelCard from "@/components/channelsPage/ChannelCard.tsx";
import EmptyState from "@/components/channelsPage/EmptyState.tsx";
import { useChannels, useJoinChannel } from "@/hooks/queries/useChannels.ts";
import ChannelCardLoading from "@/components/channelsPage/ChannelCardLoading.tsx";
import { toast } from "sonner";
import { useSearch } from "@/hooks/useSearch.ts";

const ChannelsPage = () => {
  const getChannelsQuery = useChannels();
  const joinChannelMutation = useJoinChannel();
  const [query, setQuery] = useState("");
  const { data: channels, isPending, isError } = getChannelsQuery;

  const join = (id: number) => {
    joinChannelMutation.mutate(id, {
      onSuccess: () => {
        toast.success("You joined the channel!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  const visibleChannels = useSearch({
    channels: channels ?? [],
    query,
  });

  return (
    <main>
      <div className={`container mt-10 pb-5`}>
        <ChannelSection />
        <div className="grid xl:grid-cols-6 grid-cols-1 my-10 gap-4 items-center justify-center">
          <div className="xl:col-span-5 col-span-1">
            <SearchInput onChange={setQuery} />
          </div>
          <div className="xl:col-span-1 col-span-1 w-full ">
            <NewChannelDialog />
          </div>
        </div>
        {isPending || !visibleChannels ? (
          <div className="grid xl:grid-cols-2 grid-cols-1 my-10 gap-6 items-center">
            {[1, 2, 3, 4].map((i) => (
              <ChannelCardLoading key={i} />
            ))}
          </div>
        ) : visibleChannels.length === 0 || isError ? (
          <EmptyState />
        ) : (
          <div className="grid xl:grid-cols-2 grid-cols-1 my-10 gap-6 items-center">
            {visibleChannels.map((c) => (
              <ChannelCard key={c.id} channel={c} join={join} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
export default ChannelsPage;

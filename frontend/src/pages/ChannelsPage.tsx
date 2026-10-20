import ChannelSection from "@/components/channelsPage/ChannelSection.tsx";
import { SearchInput } from "@/components/channelsPage/SearchInput.tsx";
import { useState } from "react";
import NewChannelDialog from "@/components/channelsPage/NewChannelDialog.tsx";
import ChannelCard from "@/components/channelsPage/ChannelCard.tsx";
import EmptyState from "@/components/channelsPage/EmptyState.tsx";
import { useChannels, useJoinChannel } from "@/hooks/queries/useChannels.ts";
import ChannelCardLoading from "@/components/channelsPage/ChannelCardLoading.tsx";
import { toast } from "sonner";

const ChannelsPage = () => {
  const [query, setQuery] = useState("");

  const getChannelsQuery = useChannels();
  const joinChannelMutation = useJoinChannel();

  const { data: channels, isPending, isError } = getChannelsQuery;

  // let visible = channels;
  // visible = channels!.filter((c) =>
  //   c.name.toLowerCase().includes(query.trim().toLowerCase()),
  // );

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
  return (
    <main>
      <div className={`container mt-10 pb-5`}>
        <ChannelSection />
        <div className="grid xl:grid-cols-6 grid-cols-1 my-10 gap-4 items-center justify-center">
          <div className="xl:col-span-5 col-span-1">
            <SearchInput value={query} onChange={setQuery} />
          </div>
          <div className="xl:col-span-1 col-span-1 w-full ">
            <NewChannelDialog />
          </div>
        </div>
        {isPending || !channels ? (
          <div className="grid xl:grid-cols-2 grid-cols-1 my-10 gap-6 items-center">
            {[1, 2, 3, 4].map((i) => (
              <ChannelCardLoading key={i} />
            ))}
          </div>
        ) : channels.length === 0 || isError ? (
          <EmptyState />
        ) : (
          <div className="grid xl:grid-cols-2 grid-cols-1 my-10 gap-6 items-center">
            {channels.map((c) => (
              <ChannelCard key={c.id} channel={c} join={join} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
export default ChannelsPage;

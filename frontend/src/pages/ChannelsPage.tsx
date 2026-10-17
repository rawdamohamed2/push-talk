import ChannelSection from "@/components/channelsPage/ChannelSection.tsx";
import { SearchInput } from "@/components/channelsPage/SearchInput.tsx";
import { useState } from "react";
import { mockChannels } from "@/mocks/data.ts";
import NewChannelDialog from "@/components/channelsPage/NewChannelDialog.tsx";
import ChannelCard from "@/components/channelsPage/ChannelCard.tsx";
import EmptyState from "@/components/channelsPage/EmptyState.tsx";

const ChannelsPage = () => {
  const [query, setQuery] = useState("");

  const visible = mockChannels.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const handleJoin = (id: number) => {
    console.log(id);
  };
  return (
    <main>
      <div className={`container mt-10`}>
        <ChannelSection />
        <div className="grid xl:grid-cols-6 grid-cols-1 my-10 gap-4 items-center justify-center">
          <div className="md:col-span-5 col-span-1">
            <SearchInput value={query} onChange={setQuery} />
          </div>
          <div className="md:col-span-1 col-span-1 w-full">
            <NewChannelDialog />
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid xl:grid-cols-2 grid-cols-1 my-10 gap-4 items-center">
            {visible.map((c) => (
              <ChannelCard key={c.id} channel={c} onJoin={handleJoin} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
export default ChannelsPage;

import ChannelHeading from "@/components/channels/ChannelHeading.tsx";
import { SearchInput } from "@/components/channels/SearchInput.tsx";
import { useState } from "react";
import { mockChannels } from "@/mocks/data.ts";
import ChannelDialog from "@/components/channels/ChannelDialog.tsx";

const ChannelsPage = () => {
  const [query, setQuery] = useState("");

  const visible = mockChannels.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className={`container mt-10`}>
      <ChannelHeading />
      <div className="grid md:grid-cols-6 grid-cols-1 my-10 gap-4 items-center">
        <div className="md:col-span-5 col-span-1">
          <SearchInput value={query} onChange={setQuery} />
        </div>
        <div className="md:col-span-1 col-span-1">
          <ChannelDialog />
        </div>
      </div>
    </div>
  );
};
export default ChannelsPage;

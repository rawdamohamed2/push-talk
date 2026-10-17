import { useParams } from "react-router-dom";
import RoomHeader from "@/components/channelRoomPage/roomHeader/RoomHeader.tsx";
import { mockChannels, mockOnlineUserIds, mockUsers } from "@/mocks/data.ts";

const ChannelRoomPage = () => {
  const { channelId } = useParams();
  const channel = mockChannels.find((c) => c.id === Number(channelId));

  if (!channel)
    return (
      <section className={`min-h-dvh flex justify-center items-center`}>
        <p className="p-6 text-4xl font-semibold text-muted-foreground">
          Channel not found
        </p>
      </section>
    );

  return (
    <main className={`relative bg-sidebar min-h-dvh`}>
      <RoomHeader
        channel={channel}
        members={mockUsers}
        onlineIds={mockOnlineUserIds}
        status="connected"
      />
    </main>
  );
};
export default ChannelRoomPage;

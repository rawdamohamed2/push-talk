import { useParams } from "react-router-dom";
import RoomHeader from "@/components/channelRoomPage/roomHeader/RoomHeader.tsx";
import {
  mockChannels,
  mockCurrentUser,
  mockMessages,
  mockOnlineUserIds,
  mockUsers,
} from "@/mocks/data.ts";
import MessageList from "@/components/channelRoomPage/MessageList.tsx";

const ChannelRoomPage = () => {
  const { channelId } = useParams();
  const channel = mockChannels.find((c) => c.id === Number(channelId));
  const messages = mockMessages.filter(
    (m) => m.channelId === Number(channelId),
  );
  if (!channel)
    return (
      <section className={`min-h-dvh flex justify-center items-center`}>
        <p className="p-6 text-4xl font-semibold text-muted-foreground">
          Channel not found
        </p>
      </section>
    );

  return (
    <main className={`relative bg-background`}>
      <RoomHeader
        channel={channel}
        members={mockUsers}
        onlineIds={mockOnlineUserIds}
        status="connected"
      />
      <div className={`container`}>
        <MessageList
          messages={messages}
          currentUserId={mockCurrentUser.id}
          playingId={3}
          progress={0.4}
        />
      </div>
    </main>
  );
};
export default ChannelRoomPage;

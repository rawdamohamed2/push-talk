import {
  mockChannels,
  mockCurrentUser,
  mockOnlineUserIds,
  mockUsers,
} from "@/mocks/data.ts";
import { useAudioUnlock } from "@/hooks/useAudioUnlock.ts";
import { usePlaybackQueue } from "@/hooks/usePlaybackQueue.ts";
import { useRoomMessages } from "@/hooks/useRoomMessages.ts";
import { useParams } from "react-router-dom";
import type { Channel, Message } from "@/types";
import { useEffect, useState } from "react";
import { useRecorder } from "@/hooks/useRecorder.ts";
import EnableAudioOverlay from "@/components/channelRoomPage/EnableAudioOverlay";
import RoomHeader from "@/components/channelRoomPage/roomHeader/RoomHeader";
import { Button } from "@/components/ui/button.tsx";
import QueueBanner from "@/components/channelRoomPage/QueueBanner.tsx";
import MessageList from "@/components/channelRoomPage/Message/MessageList.tsx";
import { PushToTalkButton } from "@/components/channelRoomPage/PushToTalkButton.tsx";
import EmptyState from "@/components/channelsPage/EmptyState.tsx";

const fetchSampleAudio = async () => (await fetch("/sample.mp3")).blob();

const ChannelRoomPage = () => {
  const { id } = useParams();
  const channel = mockChannels.find((c) => c.id === Number(id));

  if (!channel) {
    return (
      <main className={`my-5 p-5`}>
        <EmptyState isChannel={true} />
      </main>
    );
  }

  return <ChannelRoom key={channel.id} channel={channel} />;
};

function ChannelRoom({ channel }: { channel: Channel }) {
  const user = mockCurrentUser;
  const [mutedDismissed, setMutedDismissed] = useState(false);
  const { unlocked, unlock } = useAudioUnlock();
  const { queue, playingId, waiting, paused, progress } = usePlaybackQueue(
    user.id,
    fetchSampleAudio,
  );

  const room = useRoomMessages(channel.id);

  useEffect(() => {
    if (unlocked) queue.resume();
    else queue.pause();
  }, [unlocked, queue]);

  const recorder = useRecorder({
    onStart: () => queue.pause(),
    onEnd: () => {
      if (unlocked) queue.resume();
    },
    onFinish: (_blob, durationMs) => room.sendMockVoice(user, durationMs),
  });

  const onTogglePlay = (m: Message) => {
    if (m.id === playingId) {
      queue.toggle(m);
    } else {
      queue.playFrom(
        m,
        room.messages.filter((x) => x.status === "sent"),
      );
    }
  };
  return (
    <main className="flex h-full flex-col">
      {!unlocked && !mutedDismissed && (
        <EnableAudioOverlay
          onEnable={unlock}
          onKeepMuted={() => setMutedDismissed(true)}
        />
      )}

      <RoomHeader
        channel={channel}
        members={mockUsers}
        onlineIds={mockOnlineUserIds}
        status="connected"
      />

      {!unlocked && mutedDismissed && (
        <div className="mx-4 mt-2 flex items-center justify-between rounded-lg bg-muted px-4 py-2 text-sm">
          <span className="text-muted-foreground">
            Audio is off. Incoming messages will wait.
          </span>
          <Button size="sm" onClick={unlock}>
            Enable audio
          </Button>
        </div>
      )}

      <QueueBanner waiting={waiting} />

      <MessageList
        messages={room.messages}
        currentUserId={user.id}
        playingId={playingId}
        isPaused={paused}
        progress={progress}
        hasMore={room.hasMore}
        isLoadingOlder={room.isLoadingOlder}
        onLoadOlder={room.loadOlder}
        onTogglePlay={onTogglePlay}
      />

      {import.meta.env.DEV && (
        <Button
          variant="outline"
          size="sm"
          className="mx-auto mb-2"
          onClick={() => queue.enqueue(room.addMockIncoming())}
        >
          Simulate incoming message
        </Button>
      )}

      <PushToTalkButton
        state={recorder.state}
        elapsedMs={recorder.elapsedMs}
        onStart={recorder.start}
        onStop={recorder.stop}
      />
      {recorder.error && (
        <p role="alert" className="px-4 pb-2 text-sm text-red-400">
          {recorder.error}
        </p>
      )}
    </main>
  );
}

export default ChannelRoomPage;

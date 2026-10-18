import { useEffect, useState } from "react";
import { PlaybackQueue } from "@/lib/playbackQueue.ts";
import { BrowserAudioPlayer } from "@/lib/audioPlayer.ts";
import type { QueueState } from "@/types/playQueue.type.ts";

export function usePlaybackQueue(
  currentUserId: number,
  fetchAudio: (messageId: number) => Promise<Blob>,
) {
  const [state, setState] = useState<QueueState>({
    playingId: null,
    waiting: 0,
    paused: false,
  });
  const [progress, setProgress] = useState(0);

  const [queue] = useState(
    () =>
      new PlaybackQueue({
        currentUserId,
        player: new BrowserAudioPlayer(fetchAudio, setProgress),
        onChange: setState,
      }),
  );

  useEffect(() => () => queue.clear(), [queue]);

  return { queue, progress, ...state };
}

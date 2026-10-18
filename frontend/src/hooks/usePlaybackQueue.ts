import { useEffect, useRef, useState } from "react";
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
  });

  const fetchRef = useRef(fetchAudio);
  fetchRef.current = fetchAudio;

  const queueRef = useRef<PlaybackQueue | null>(null);
  if (!queueRef.current) {
    queueRef.current = new PlaybackQueue({
      currentUserId,
      player: new BrowserAudioPlayer((id) => fetchRef.current(id)),
      onChange: setState,
    });
  }

  useEffect(() => {
    const queue = queueRef.current;
    return () => queue?.clear();
  }, []);

  return { queue: queueRef.current, ...state };
}

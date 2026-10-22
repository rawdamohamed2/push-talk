import { useCallback, useState } from "react";

function canAutoplay(): boolean {
  try {
    const ctx = new AudioContext();
    const running = ctx.state === "running";
    void ctx.close();
    return running;
  } catch {
    return false;
  }
}

export function useAudioUnlock() {
  const [unlocked, setUnlocked] = useState(canAutoplay);

  const unlock = useCallback(async () => {
    try {
      const ctx = new AudioContext();
      await ctx.resume();
      await ctx.close();
    } catch (error) {
      return error;
    }
    setUnlocked(true);
  }, []);

  return { unlocked, unlock };
}

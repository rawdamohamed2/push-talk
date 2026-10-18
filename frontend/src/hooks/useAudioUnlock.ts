import { useCallback, useState } from "react";

export function useAudioUnlock() {
  const [unlocked, setUnlocked] = useState(false);

  const unlock = useCallback(async () => {
    try {
      const ctx = new AudioContext();
      await ctx.resume();
      await ctx.close();
    } catch {}
    setUnlocked(true);
  }, []);

  return { unlocked, unlock };
}

import { useCallback, useEffect, useRef, useState } from "react";

export const MIN_DURATION_MS = 500;
export const MAX_DURATION_MS = 60_000;

export type RecorderState = "idle" | "recording" | "tooShort";

interface UseRecorderOptions {
  onStart?: () => void;
  onFinish?: (blob: Blob, durationMs: number) => void;
  onEnd?: () => void;
}

function pickMimeType(): string | undefined {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
  ];
  return candidates.find((t) => MediaRecorder.isTypeSupported(t));
}

export function useRecorder({
  onStart,
  onFinish,
  onEnd,
}: UseRecorderOptions = {}) {
  const [state, setState] = useState<RecorderState>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);
  const tickRef = useRef<number | null>(null);
  const startingRef = useRef(false);
  const cancelRequestedRef = useRef(false);

  const callbacksRef = useRef({ onStart, onFinish, onEnd });
  callbacksRef.current = { onStart, onFinish, onEnd };

  const cleanup = useCallback(() => {
    if (tickRef.current !== null) window.clearInterval(tickRef.current);
    tickRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recorderRef.current = null;
  }, []);

  const stop = useCallback(() => {
    cancelRequestedRef.current = true;
    const recorder = recorderRef.current;
    if (recorder && recorder.state === "recording") recorder.stop();
  }, []);

  const start = useCallback(async () => {
    if (startingRef.current || recorderRef.current) return;
    startingRef.current = true;
    cancelRequestedRef.current = false;
    setError(null);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      startingRef.current = false;
      const denied = e instanceof DOMException && e.name === "NotAllowedError";
      setError(
        denied
          ? "Microphone access is blocked. Allow it in your browser settings to send messages."
          : "Could not access the microphone.",
      );
      return;
    }

    // المستخدم فلّت الزر قبل ما المايك يجهز
    if (cancelRequestedRef.current) {
      stream.getTracks().forEach((t) => t.stop());
      startingRef.current = false;
      return;
    }

    streamRef.current = stream;
    chunksRef.current = [];
    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(
      stream,
      mimeType ? { mimeType } : undefined,
    );
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const durationMs = Date.now() - startedAtRef.current;
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
      cleanup();
      setElapsedMs(0);

      if (durationMs < MIN_DURATION_MS) {
        setState("tooShort");
        window.setTimeout(() => setState("idle"), 1500);
      } else {
        setState("idle");
        callbacksRef.current.onFinish?.(blob, durationMs);
      }
      callbacksRef.current.onEnd?.();
    };

    startedAtRef.current = Date.now();
    recorder.start();
    startingRef.current = false;
    setState("recording");
    callbacksRef.current.onStart?.();

    tickRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAtRef.current;
      setElapsedMs(elapsed);
      if (elapsed >= MAX_DURATION_MS) recorder.stop(); // حد أقصى تلقائي
    }, 100);
  }, [cleanup]);

  useEffect(
    () => () => {
      const recorder = recorderRef.current;
      if (recorder && recorder.state === "recording") {
        recorder.onstop = null;
        recorder.stop();
      }
      cleanup();
    },
    [cleanup],
  );

  return {
    state,
    elapsedMs,
    error,
    start,
    stop,
    clearError: () => setError(null),
  };
}

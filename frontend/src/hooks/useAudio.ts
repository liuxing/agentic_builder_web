import { useRef, useCallback, useState } from "react";

export interface UseAudioReturn {
  /**
   * Play the session-completion chime.
   * Returns `true` if playback started successfully, `false` otherwise.
   */
  playCompletionSound: () => Promise<boolean>;
  /** Whether the browser supports audio playback. */
  audioAvailable: boolean;
}

/**
 * Hook for HTML5 / Web Audio API completion sound playback.
 *
 * Generates a three-note ascending chime (C5–E5–G5) using the Web Audio API.
 * Handles browser autoplay restrictions by resuming a suspended AudioContext.
 * If audio is completely unavailable (e.g. no AudioContext support), the hook
 * sets `audioAvailable` to `false` and `playCompletionSound` resolves to `false`.
 */
export function useAudio(): UseAudioReturn {
  const [audioAvailable, setAudioAvailable] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback((): AudioContext | null => {
    if (!audioContextRef.current) {
      try {
        const Ctor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        audioContextRef.current = new Ctor();
      } catch {
        setAudioAvailable(false);
        return null;
      }
    }
    return audioContextRef.current;
  }, []);

  const playCompletionSound = useCallback(async (): Promise<boolean> => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return false;

      // Resume if suspended (browser autoplay policy).
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const now = ctx.currentTime;

      // Three-note ascending chime: C5 → E5 → G5
      const frequencies = [523.25, 659.25, 783.99];

      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.15);

        gain.gain.setValueAtTime(0, now + i * 0.15);
        gain.gain.linearRampToValueAtTime(0.3, now + i * 0.15 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.4);
      });

      return true;
    } catch {
      setAudioAvailable(false);
      return false;
    }
  }, [getAudioContext]);

  return { playCompletionSound, audioAvailable };
}
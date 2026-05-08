/**
 * TimerProvider — wraps useTimer + useAudio in React context so the entire app
 * can access timer state, controls, and audio playback without prop drilling.
 */
import React, { createContext, useContext, type ReactNode } from "react";
import { useTimer, type UseTimerReturn } from "@/hooks/useTimer";
import { useAudio, type UseAudioReturn } from "@/hooks/useAudio";
import type { TimerMode } from "@/types/timer";

export interface TimerContextValue {
  /**
   * All timer state and control methods.
   * See `useTimer` for the full contract.
   */
  timer: UseTimerReturn;
  /**
   * Audio playback utilities.
   * See `useAudio` for the full contract.
   */
  audio: UseAudioReturn;
}

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  // Wire up useAudio so we can pass playCompletionSound into useTimer's
  // onComplete callback.
  const audio = useAudio();

  const onComplete = React.useCallback(
    (_mode: TimerMode) => {
      // Trigger the completion chime.
      audio.playCompletionSound();
    },
    [audio],
  );

  const timer = useTimer({ onComplete });

  return (
    <TimerContext.Provider value={{ timer, audio }}>
      {children}
    </TimerContext.Provider>
  );
}

/**
 * Access the timer context from any descendant component.
 * Throws if used outside of <TimerProvider>.
 */
export function useTimerContext(): TimerContextValue {
  const ctx = useContext(TimerContext);
  if (!ctx) {
    throw new Error("useTimerContext must be used within a <TimerProvider>");
  }
  return ctx;
}

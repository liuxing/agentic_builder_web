import type { TimerMode, TimerSession } from "@/types/timer";

/**
 * Format seconds into MM:SS display string.
 * Always shows two digits for minutes and seconds.
 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Return the default duration in seconds for a given mode.
 * Focus: 25 minutes (1500s), Break: 5 minutes (300s).
 */
export function getDefaultDuration(mode: TimerMode): number {
  return mode === "focus" ? 1500 : 300;
}

/**
 * Factory to create a fresh TimerSession for the given mode.
 * Defaults to Focus mode if none provided.
 */
export function createInitialTimerSession(mode: TimerMode = "focus"): TimerSession {
  const defaultDurationSeconds = getDefaultDuration(mode);
  return {
    mode,
    defaultDurationSeconds,
    remainingSeconds: defaultDurationSeconds,
    status: "idle",
    startedAt: null,
    completedAt: null,
  };
}
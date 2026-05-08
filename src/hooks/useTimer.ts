import { useState, useRef, useCallback, useEffect } from "react";
import type { TimerMode, TimerStatus, TimerSession, UIState } from "@/types/timer";

// ---------------------------------------------------------------------------
// Public hook options & return type (imported by TimerProvider / contexts)
// ---------------------------------------------------------------------------

export interface UseTimerOptions {
  /** Called when any session (focus or break) reaches 0. */
  onComplete?: (mode: TimerMode) => void;
}

export interface UseTimerReturn {
  /** Current session state */
  session: TimerSession;
  /** UI-related flags */
  uiState: UIState;

  // Controls
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;

  // Mode switching
  switchMode: (nextMode: TimerMode) => void;
  confirmModeSwitch: () => void;
  cancelModeSwitch: () => void;

  // Completion
  dismissCompletion: () => void;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------
const DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60, // 1500 s
  break: 5 * 60,  // 300 s
};

function createSession(mode: TimerMode): TimerSession {
  return {
    mode,
    defaultDurationSeconds: DURATIONS[mode],
    remainingSeconds: DURATIONS[mode],
    status: "idle",
    startedAt: null,
    completedAt: null,
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useTimer(options: UseTimerOptions = {}): UseTimerReturn {
  const { onComplete } = options;

  // ── State ────────────────────────────────────────────────────────────────
  const [session, setSession] = useState<TimerSession>(() => createSession("focus"));
  const [uiState, setUIState] = useState<UIState>(() => ({
    showCompletionMessage: false,
    showModeSwitchConfirm: false,
    audioAvailable: typeof window !== "undefined" && !!window.Audio, // rough detection
    errorState: null,
  }));

  // Pending mode when confirmation is required
  const pendingModeRef = useRef<TimerMode | null>(null);

  // Stable refs for interval & latest values (avoids stale closure issues)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const remainingRef = useRef(session.remainingSeconds);
  const statusRef = useRef(session.status);
  const sessionRef = useRef(session);
  const onCompleteRef = useRef(onComplete);

  // Keep refs in sync with state
  useEffect(() => {
    remainingRef.current = session.remainingSeconds;
    statusRef.current = session.status;
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // ── Cleanup interval on unmount ─────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ── Tick handler ─────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const currentRemaining = remainingRef.current;
    const currentStatus = statusRef.current;

    // Guard: only tick while running
    if (currentStatus !== "running") return;

    if (currentRemaining <= 1) {
      // Reached 00:00
      clearInterval(intervalRef.current!);
      intervalRef.current = null;

      const completedMode = sessionRef.current.mode;

      setSession((prev) => ({
        ...prev,
        remainingSeconds: 0,
        status: "completed",
        completedAt: new Date(),
      }));
      setUIState((prev) => ({ ...prev, showCompletionMessage: true }));

      // Fire callback
      onCompleteRef.current?.(completedMode);
    } else {
      // Normal decrement
      setSession((prev) => ({
        ...prev,
        remainingSeconds: prev.remainingSeconds - 1,
      }));
    }
  }, []);

  // ── Start / Pause / Resume ──────────────────────────────────────────────
  const start = useCallback(() => {
    // If completed, reset first then start
    if (sessionRef.current.status === "completed") {
      const mode = sessionRef.current.mode;
      setSession((prev) => ({
        ...prev,
        remainingSeconds: DURATIONS[mode],
        status: "running",
        startedAt: new Date(),
        completedAt: null,
      }));
    } else {
      setSession((prev) => ({
        ...prev,
        status: "running",
        startedAt: prev.startedAt ?? new Date(),
      }));
    }
    // Clear any existing interval before starting a new one
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  const pause = useCallback(() => {
    if (statusRef.current !== "running") return;
    clearInterval(intervalRef.current!);
    intervalRef.current = null;
    setSession((prev) => ({ ...prev, status: "paused" }));
  }, []);

  const resume = useCallback(() => {
    if (statusRef.current !== "paused") return;
    setSession((prev) => ({ ...prev, status: "running" }));
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  // ── Reset (preserves mode) ──────────────────────────────────────────────
  const reset = useCallback(() => {
    // Stop the timer if running/paused
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Preserve the current mode, only reset duration and status
    const currentMode = sessionRef.current.mode;
    setSession((prev) => ({
      ...prev,
      mode: currentMode,             // explicit preservation (no change)
      remainingSeconds: DURATIONS[currentMode],
      status: "idle",
      startedAt: null,
      completedAt: null,
    }));
    // Dismiss any completion message that might be shown
    setUIState((prev) => ({ ...prev, showCompletionMessage: false }));
  }, []);

  // ── Mode switching with confirmation ────────────────────────────────────
  const switchMode = useCallback(
    (nextMode: TimerMode) => {
      const currentStatus = statusRef.current;
      const currentMode = sessionRef.current.mode;

      if (nextMode === currentMode) return; // no-op

      if (currentStatus === "running") {
        // Running → ask for confirmation
        pendingModeRef.current = nextMode;
        setUIState((prev) => ({ ...prev, showModeSwitchConfirm: true }));
      } else {
        // Idle or paused → switch immediately and reset
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setSession(createSession(nextMode));
        // Dismiss any completion UI when changing modes
        setUIState((prev) => ({ ...prev, showCompletionMessage: false }));
      }
    },
    [],
  );

  const confirmModeSwitch = useCallback(() => {
    const pending = pendingModeRef.current;
    if (!pending) return;

    // Stop any active interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Apply the pending mode
    setSession(createSession(pending));
    pendingModeRef.current = null;

    setUIState((prev) => ({
      ...prev,
      showModeSwitchConfirm: false,
      showCompletionMessage: false,
    }));
  }, []);

  const cancelModeSwitch = useCallback(() => {
    pendingModeRef.current = null;
    setUIState((prev) => ({ ...prev, showModeSwitchConfirm: false }));
  }, []);

  // ── Completion dismissal ─────────────────────────────────────────────────
  const dismissCompletion = useCallback(() => {
    setUIState((prev) => ({ ...prev, showCompletionMessage: false }));
    // If the user dismisses while still in "completed" status, keep it;
    // next Start will reset automatically.
  }, []);

  // ── Return ───────────────────────────────────────────────────────────────
  return {
    session,
    uiState,
    start,
    pause,
    resume,
    reset,
    switchMode,
    confirmModeSwitch,
    cancelModeSwitch,
    dismissCompletion,
  };
}
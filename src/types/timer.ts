export type TimerMode = "focus" | "break";
export type TimerStatus = "idle" | "running" | "paused" | "completed";

export interface TimerSession {
  mode: TimerMode;
  defaultDurationSeconds: number;
  remainingSeconds: number;
  status: TimerStatus;
  startedAt: Date | null;
  completedAt: Date | null;
}

export interface UIState {
  showCompletionMessage: boolean;
  showModeSwitchConfirm: boolean;
  audioAvailable: boolean;
  errorState: string | null;
}
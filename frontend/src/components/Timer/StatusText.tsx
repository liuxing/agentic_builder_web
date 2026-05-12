import React from "react";
import { useTimerContext } from "@/providers/TimerProvider";

/**
 * StatusText — displays the current timer state as a human-readable label
 * below the countdown timer.
 *
 * Possible labels:
 *   - "Ready to focus" / "Ready for a break" (idle)
 *   - "Running"
 *   - "Paused"
 *   - "Focus session complete!" / "Break complete!" (completed or when the
 *     completion banner is visible)
 */
const StatusText: React.FC = () => {
  const { timer } = useTimerContext();
  const { session, uiState } = timer;

  let statusText: string;

  // The completion message stays visible until dismissed, so we show a
  // celebratory label while the banner is present and while status is "completed".
  if (uiState.showCompletionMessage || session.status === "completed") {
    statusText =
      session.mode === "focus"
        ? "Focus session complete!"
        : "Break complete!";
  } else {
    switch (session.status) {
      case "idle":
        statusText =
          session.mode === "focus" ? "Ready to focus" : "Ready for a break";
        break;
      case "running":
        statusText = "Running";
        break;
      case "paused":
        statusText = "Paused";
        break;
      default:
        statusText = "";
    }
  }

  return (
    <p
      className="text-sm text-zinc-400 mt-2 text-center"
      role="status"
      aria-live="polite"
    >
      {statusText}
    </p>
  );
};

export default StatusText;
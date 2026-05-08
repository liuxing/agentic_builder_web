import React from "react";
import { useTimerContext } from "@/providers/TimerProvider";
import { formatTime } from "@/utils/timerUtils";

/**
 * TimerDisplay — renders the countdown in large MM:SS format.
 *
 * This is the most visually prominent element on the page:
 *   - ~7xl text on desktop, scaling down for mobile readability.
 *   - Tabular-nums so digits don't shift width on tick.
 *   - When a session completes, the timer pulses briefly via a Tailwind
 *     animation class (`animate-pulse`) and stays at the designated colour.
 */
const TimerDisplay: React.FC = () => {
  const { timer } = useTimerContext();
  const { session, uiState } = timer;

  const display = formatTime(session.remainingSeconds);

  // When the session is completed, apply an accent colour + a subtle pulse.
  const isCompleted = session.status === "completed" || uiState.showCompletionMessage;

  return (
    <div
      className="select-none"
      role="timer"
      aria-live="polite"
      aria-label={`${session.mode === "focus" ? "Focus" : "Break"} timer — ${display}`}
    >
      <span
        className={`
          font-mono tabular-nums tracking-tight
          text-7xl sm:text-8xl md:text-9xl
          ${isCompleted
            ? "text-indigo-400 animate-pulse"
            : "text-zinc-100"}
        `}
      >
        {display}
      </span>
    </div>
  );
};

export default TimerDisplay;
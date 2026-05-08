import React from "react";
import { useTimerContext } from "@/providers/TimerProvider";
import type { TimerMode } from "@/types/timer";

/**
 * ModeSelector — Focus / Break toggle buttons (CMP-001, CMP-002).
 *
 * - Highlights the active mode with an indigo accent background and border.
 * - Clicking the inactive mode calls `switchMode`, which internally:
 *     - Switches immediately if the timer is idle or paused.
 *     - Opens the confirmation dialog if the timer is running.
 * - Disabled while a completion message is showing (user must dismiss first).
 */
const ModeSelector: React.FC = () => {
  const { timer } = useTimerContext();
  const { session, uiState, switchMode } = timer;

  const modes: { mode: TimerMode; label: string }[] = [
    { mode: "focus", label: "Focus" },
    { mode: "break", label: "Break" },
  ];

  const isDisabled = uiState.showCompletionMessage;

  return (
    <div
      className="inline-flex rounded-lg bg-zinc-800 p-1 gap-1"
      role="radiogroup"
      aria-label="Timer mode"
    >
      {modes.map(({ mode, label }) => {
        const isActive = session.mode === mode;

        return (
          <button
            key={mode}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={isDisabled}
            onClick={() => switchMode(mode)}
            className={`
              px-5 py-2 rounded-md text-sm font-medium
              transition-colors duration-150
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500
              ${isActive
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/60"
              }
              ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default ModeSelector;
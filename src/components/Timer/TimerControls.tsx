import React from "react";
import { useTimerContext } from "@/providers/TimerProvider";
import Button from "@/components/UI/Button";

/**
 * TimerControls — Start/Pause/Resume and Reset buttons.
 *
 * - Primary button label changes based on timer status:
 *     idle / completed → "Start"
 *     running          → "Pause"
 *     paused           → "Resume"
 * - Reset button always resets to the current mode's default duration without
 *   changing the selected mode (Focus ↔ Break). Mode persistence (FR-MM04) is
 *   guaranteed by the hook, not by this UI layer.
 * - Both buttons are disabled while the completion message is shown.
 */
const TimerControls: React.FC = () => {
  const { timer } = useTimerContext();
  const { session, uiState, start, pause, resume, reset } = timer;

  const isDisabled = uiState.showCompletionMessage;

  // Determine primary button label and action.
  let primaryLabel: string;
  let primaryAction: () => void;

  switch (session.status) {
    case "running":
      primaryLabel = "Pause";
      primaryAction = pause;
      break;
    case "paused":
      primaryLabel = "Resume";
      primaryAction = resume;
      break;
    case "idle":
    case "completed":
    default:
      primaryLabel = "Start";
      primaryAction = start;
      break;
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <Button
        variant="primary"
        onClick={primaryAction}
        disabled={isDisabled}
        aria-label={primaryLabel}
        data-testid="timer-primary-btn"
      >
        {primaryLabel}
      </Button>
      <Button
        variant="secondary"
        onClick={reset}
        disabled={isDisabled}
        aria-label="Reset timer"
        data-testid="timer-reset-btn"
      >
        Reset
      </Button>
    </div>
  );
};

export default TimerControls;
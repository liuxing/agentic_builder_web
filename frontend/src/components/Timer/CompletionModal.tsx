import React from "react";
import { useTimerContext } from "@/providers/TimerProvider";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";

/**
 * CompletionModal — session completion dialog/banner (PAGE-003).
 *
 * - Shown when `uiState.showCompletionMessage` is true, which happens
 *   automatically when the timer reaches 00:00.
 * - Displays "Focus session complete!" or "Break complete!" based on the
 *   current mode.
 * - Includes a Dismiss button (CMP-005).
 * - Supports Escape key dismissal via the reusable Modal wrapper (CMP-010).
 * - Clicking outside the modal also dismisses it.
 */
const CompletionModal: React.FC = () => {
  const { timer } = useTimerContext();
  const { session, uiState, dismissCompletion } = timer;

  const isOpen = uiState.showCompletionMessage;

  const title =
    session.mode === "focus"
      ? "Focus session complete!"
      : "Break complete!";

  const description =
    session.mode === "focus"
      ? "Great work! Time for a break."
      : "Break is over. Ready to focus again?";

  return (
    <Modal open={isOpen} onClose={dismissCompletion}>
      {/* Icon / visual indicator */}
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600/20">
          <svg
            className="w-6 h-6 text-indigo-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-zinc-100 mb-1">{title}</h2>

        {/* Supporting description */}
        <p className="text-sm text-zinc-400 mb-5">{description}</p>

        {/* Dismiss button */}
        <Button
          variant="primary"
          onClick={dismissCompletion}
          aria-label="Dismiss completion message"
        >
          Dismiss
        </Button>
      </div>
    </Modal>
  );
};

export default CompletionModal;
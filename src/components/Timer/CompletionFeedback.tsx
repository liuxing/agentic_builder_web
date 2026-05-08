import React, { useRef, useEffect } from "react";
import { useTimerContext } from "@/providers/TimerProvider";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import Button from "@/components/UI/Button";

/**
 * CompletionFeedback — session completion dialog with keyboard support.
 *
 * - Shown when `uiState.showCompletionMessage` is true.
 * - Dismissible via Escape key (using useKeyboardShortcuts hook).
 * - Dismissible via backdrop click.
 * - Auto-focuses the Dismiss button when the dialog appears for
 *   immediate keyboard interaction.
 */
const CompletionFeedback: React.FC = () => {
  const { timer } = useTimerContext();
  const { session, uiState, dismissCompletion } = timer;

  // Ref for the dismiss button so we can focus it on open.
  const dismissButtonRef = useRef<HTMLButtonElement>(null);

  const isOpen = uiState.showCompletionMessage;

  // Escape key dismissal
  useKeyboardShortcuts({
    onEscape: dismissCompletion,
    enabled: isOpen,
  });

  // Focus the dismiss button when the feedback appears
  useEffect(() => {
    if (isOpen && dismissButtonRef.current) {
      dismissButtonRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const title =
    session.mode === "focus"
      ? "Focus session complete!"
      : "Break complete!";

  const description =
    session.mode === "focus"
      ? "Great work! Time for a break."
      : "Break is over. Ready to focus again?";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={dismissCompletion}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div
        className="relative z-10 w-full max-w-sm mx-4 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-6"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon / visual indicator */}
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

          {/* Dismiss button — auto-focused on open for keyboard accessibility */}
          <Button
            ref={dismissButtonRef}
            variant="primary"
            onClick={dismissCompletion}
            aria-label="Dismiss completion message"
          >
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompletionFeedback;
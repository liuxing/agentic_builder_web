import React from "react";
import TimerDisplay from "@/components/Timer/TimerDisplay";
import ModeSelector from "@/components/Timer/ModeSelector";
import StatusText from "@/components/Timer/StatusText";
import TimerControls from "@/components/Timer/TimerControls";
import CompletionFeedback from "@/components/Timer/CompletionFeedback";
import ModeSwitchConfirmModal from "@/components/Timer/ModeSwitchConfirmModal";

/**
 * TimerPage — main landing page (PAGE-001).
 *
 * Assembles all timer components in the proper layout regions:
 *   1. Mode selection (Focus / Break)
 *   2. Large countdown display
 *   3. Status text
 *   4. Primary controls (Start/Pause/Resume + Reset)
 *   5. Completion feedback (shown on session end, dismissible via click or Escape)
 *   6. Mode-switch confirmation modal (shown when switching while running)
 *
 * The parent AppLayout already provides a centered, max-w-md container,
 * so this page simply stacks components vertically with consistent spacing.
 */
const TimerPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-y-6 w-full">
      <ModeSelector />
      <TimerDisplay />
      <StatusText />
      <TimerControls />
      <CompletionFeedback />
      <ModeSwitchConfirmModal />
    </div>
  );
};

export default TimerPage;
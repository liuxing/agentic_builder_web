import React from "react";
import { useTimerContext } from "@/providers/TimerProvider";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";

/**
 * ModeSwitchConfirmModal — confirmation dialog when the user attempts to
 * switch modes while the timer is running (PAGE-002).
 *
 * - Shown when `uiState.showModeSwitchConfirm` is true.
 * - Title: "Switch mode?"
 * - Warning: "Switching modes will reset your current session."
 * - Confirm button (CMP-006): applies the pending mode switch and resets.
 * - Cancel button (CMP-007): closes the dialog without changes.
 * - Backdrop click (CMP-008) and Escape key (CMP-009) also cancel.
 */
const ModeSwitchConfirmModal: React.FC = () => {
  const { timer } = useTimerContext();
  const { uiState, confirmModeSwitch, cancelModeSwitch } = timer;

  const isOpen = uiState.showModeSwitchConfirm;

  return (
    <Modal open={isOpen} onClose={cancelModeSwitch}>
      <div className="flex flex-col items-center text-center">
        {/* Title */}
        <h2 className="text-lg font-semibold text-zinc-100 mb-2">
          Switch mode?
        </h2>

        {/* Warning text */}
        <p className="text-sm text-zinc-400 mb-5">
          Switching modes will reset your current session.
        </p>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={cancelModeSwitch}
            aria-label="Cancel mode switch"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={confirmModeSwitch}
            aria-label="Confirm mode switch"
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModeSwitchConfirmModal;
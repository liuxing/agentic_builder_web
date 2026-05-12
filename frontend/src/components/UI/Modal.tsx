import React, { useEffect, useCallback } from "react";

interface ModalProps {
  /**
   * Whether the modal is currently visible.
   */
  open: boolean;
  /**
   * Called when the user requests dismissal (Escape, backdrop click).
   * The parent should set `open` to `false` in response.
   */
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Reusable modal with overlay backdrop, centered container, Escape key
 * handling, and click-outside-to-close behaviour.
 *
 * Uses a React portal-free inline approach — rendered in the normal DOM
 * flow with an absolutely-positioned backdrop overlay. Works for the
 * single-modal-at-a-time Pomodoro use case without portal overhead.
 */
const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  // Escape key handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll while modal is open
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div
        className="relative z-10 w-full max-w-sm mx-4 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-6"
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
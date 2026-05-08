import { useEffect } from "react";

interface UseKeyboardShortcutsOptions {
  /**
   * Callback invoked when the Escape key is pressed.
   */
  onEscape?: () => void;
  /**
   * When false, the listener is not attached.
   * Defaults to true.
   */
  enabled?: boolean;
}

/**
 * Registers a global keydown listener for the Escape key.
 * Only active when `enabled` is true and `onEscape` is provided.
 */
export function useKeyboardShortcuts({
  onEscape,
  enabled = true,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled || !onEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscape();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onEscape]);
}
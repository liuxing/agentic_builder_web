import React from "react";
import type { TimerMode } from "../types/timer";

export type { TimerMode } from "../types/timer";

export interface ModeSelectorProps {
  mode?: TimerMode;
  selectedMode?: TimerMode;
  onModeChange?: (mode: TimerMode) => void;
  onChange?: (mode: TimerMode) => void;
  setMode?: (mode: TimerMode) => void;
  className?: string;
}

const baseBtn =
  "px-3 py-2 rounded-md border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2";
const activeBtn = "bg-black text-white border-black";
const inactiveBtn = "bg-white text-black border-gray-300 hover:bg-gray-50";

const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  selectedMode,
  onModeChange,
  onChange,
  setMode,
  className,
}) => {
  // First render defaults to Focus mode selected.
  const currentMode: TimerMode = selectedMode ?? mode ?? "focus";

  const handleSelect = (nextMode: TimerMode) => {
    setMode?.(nextMode);
    onModeChange?.(nextMode);
    onChange?.(nextMode);
  };

  return (
    <div className={className} role="tablist" aria-label="Timer mode selector">
      <button
        type="button"
        role="tab"
        aria-selected={currentMode === "focus"}
        className={`${baseBtn} ${currentMode === "focus" ? activeBtn : inactiveBtn}`}
        onClick={() => handleSelect("focus")}
      >
        Focus
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={currentMode === "break"}
        className={`${baseBtn} ${currentMode === "break" ? activeBtn : inactiveBtn}`}
        onClick={() => handleSelect("break")}
      >
        Break
      </button>
    </div>
  );
};

export default ModeSelector;
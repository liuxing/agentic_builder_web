import React, { useMemo } from "react";

export interface TimerDisplayProps {
  seconds?: number;
  timeLeft?: number;
  remainingSeconds?: number;
  formattedTime?: string;
  className?: string;
}

const DEFAULT_TIME = "25:00";

const toFormatted = (totalSeconds: number): string => {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  seconds,
  timeLeft,
  remainingSeconds,
  formattedTime,
  className,
}) => {
  const value = useMemo(() => {
    if (typeof formattedTime === "string" && formattedTime.length > 0) return formattedTime;
    if (typeof seconds === "number") return toFormatted(seconds);
    if (typeof timeLeft === "number") return toFormatted(timeLeft);
    if (typeof remainingSeconds === "number") return toFormatted(remainingSeconds);
    // Default first-load display.
    return DEFAULT_TIME;
  }, [formattedTime, seconds, timeLeft, remainingSeconds]);

  return (
    <div className={className} aria-live="polite" aria-label="Timer display">
      {value}
    </div>
  );
};

export default TimerDisplay;
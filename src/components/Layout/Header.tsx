/**
 * Header component — displays the app title "Pomodoro Timer".
 * Responsive: large text on desktop, smaller on mobile, centered with proper spacing.
 */
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 md:py-6 flex items-center justify-center bg-zinc-950 border-b border-zinc-800">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
        Pomodoro Timer
      </h1>
    </header>
  );
};

export default Header;
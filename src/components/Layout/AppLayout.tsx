/**
 * AppLayout — responsive shell with header, centered main content area, and footer.
 * Uses zinc-950 background, zinc-100 text, and indigo accents for the dark theme.
 */
import React from "react";
import Header from "./Header";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 md:py-8">
        {/* Central content area with constrained max-width for better readability */}
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="py-3 px-4 text-center text-xs text-zinc-500 border-t border-zinc-800">
        Stay focused. Take breaks. Repeat.
      </footer>
    </div>
  );
};

export default AppLayout;
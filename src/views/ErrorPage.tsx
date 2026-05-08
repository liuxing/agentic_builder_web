import React from "react";
import { Link } from "react-router-dom";
import Button from "@/components/UI/Button";

/**
 * ErrorPage — critical failure / unsupported browser state (PAGE-004).
 *
 * Displays a centered error message with two recovery actions:
 *   - Retry (CMP-011): reloads the application.
 *   - Back to Timer (CMP-012): navigates to the main timer page.
 *
 * This page is used both as a standalone route (`/error`) and as the
 * fallback UI rendered by the ErrorBoundary in App.tsx.
 */
const ErrorPage: React.FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-2xl font-bold text-zinc-100 mb-3">
        Something went wrong
      </h1>
      <p className="text-zinc-400 mb-6 max-w-sm">
        The application encountered an unexpected error. Please try again or
        return to the timer.
      </p>
      <div className="flex gap-4">
        <Button variant="primary" onClick={handleRetry} aria-label="Retry">
          Retry
        </Button>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-semibold bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          Back to Timer
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
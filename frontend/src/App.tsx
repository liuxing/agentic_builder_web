import React from "react";
import { TimerProvider } from "./providers/TimerProvider";
import AppLayout from "./components/Layout/AppLayout";
import { AppRouter } from "./router";
import ErrorPage from "./views/ErrorPage";

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App error boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }
    return this.props.children;
  }
}

/**
 * Root application component.
 * Wraps the entire app with TimerProvider and the responsive AppLayout shell,
 * then renders the router inside an error boundary so that rendering crashes
 * show the recovery UI instead of a blank screen.
 */
export default function App() {
  return (
    <TimerProvider>
      <AppLayout>
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </AppLayout>
    </TimerProvider>
  );
}
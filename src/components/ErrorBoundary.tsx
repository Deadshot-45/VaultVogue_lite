import React from "react";
import { logError } from "@/lib/log-error";

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError(error, "React ErrorBoundary");
    console.error(errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-svh items-center justify-center">
          <p className="text-sm text-muted-foreground">
            A critical error occurred.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

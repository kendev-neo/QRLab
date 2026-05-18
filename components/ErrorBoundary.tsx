"use client";
import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details to console for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cream px-4">
          <div className="max-w-md w-full">
            <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-soft)] text-center">
              {/* Error Icon */}
              <div className="mx-auto w-16 h-16 rounded-full bg-rose/10 flex items-center justify-center mb-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-rose"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>

              {/* Error Message */}
              <h1 className="text-2xl font-display font-bold text-ink mb-2">
                Something went wrong
              </h1>
              <p className="text-sm text-ink-soft mb-6 leading-relaxed">
                We encountered an unexpected error. Don&#39;t worry, your data is safe.
                Please try again.
              </p>

              {/* Error Details (Development only) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="text-xs font-semibold text-ink-soft cursor-pointer hover:text-ink transition mb-2">
                    Error Details (Development)
                  </summary>
                  <div className="rounded-xl bg-cream-deep p-3 text-xs font-mono text-ink-soft overflow-auto max-h-40">
                    <p className="font-semibold text-rose mb-1">
                      {this.state.error.name}: {this.state.error.message}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="whitespace-pre-wrap text-[10px] mt-2">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold transition active:scale-[0.98] bg-peach-deep text-white hover:bg-[color-mix(in_oklab,var(--color-peach-deep)_88%,black)] shadow-[var(--shadow-soft)] px-6 py-3 text-sm"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = "/"}
                  className="inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold transition active:scale-[0.98] bg-cream-deep text-ink-soft hover:text-ink px-6 py-3 text-sm"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

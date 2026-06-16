"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode; // custom fallback UI
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production this would go to an error reporting service
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className={cn(
            "flex flex-col items-center justify-center",
            "min-h-[200px] w-full rounded-[12px] p-8",
            "bg-[#0f1a0f] border border-white/[0.08]",
            "text-center"
          )}
          role="alert"
        >
          {/* Error icon */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-4 text-[#ef4444]"
            aria-hidden="true"
          >
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />
            <path
              d="M16 9v8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="16" cy="22" r="1.5" fill="currentColor" />
          </svg>

          <p className="text-[13px] font-medium text-white/70 mb-1">
            Something went wrong
          </p>

          {this.state.error?.message && (
            <p className="text-[12px] text-white/35 mb-5 max-w-xs font-mono">
              {this.state.error.message}
            </p>
          )}

          <button
            onClick={this.handleReset}
            className={cn(
              "px-4 py-1.5 rounded-[8px] text-[13px] font-medium",
              "bg-[#162116] border border-white/[0.08]",
              "text-white/70 hover:text-white",
              "hover:bg-[#1a2e1a] transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ade80]/50"
            )}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
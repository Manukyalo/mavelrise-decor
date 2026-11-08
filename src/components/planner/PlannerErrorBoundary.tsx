"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class PlannerErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[PlannerErrorBoundary caught error]:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 top-[72px] sm:top-[80px] bg-brand-navy flex flex-col items-center justify-center p-6 z-40 text-center">
          <div className="max-w-md p-8 rounded-sm bg-brand-navy-card border border-brand-gold/30 shadow-2xl space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="font-display text-xl text-brand-ivory uppercase tracking-wide">
                Visualizer Recovery Mode
              </h2>
              <p className="text-xs font-sans text-brand-ivory/70 leading-relaxed">
                The 3D engine encountered an unexpected input state. Your layout data is preserved.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xs bg-brand-navy border border-brand-gold/15 text-[10px] font-mono text-brand-gold/80 break-words text-left">
                {this.state.error.message || "Unknown error"}
              </div>
            )}

            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-brand-gold hover:bg-brand-gold-hover text-brand-navy text-xs font-mono uppercase tracking-widest font-bold transition-all duration-300 shadow-xl shadow-brand-gold/25"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Studio</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


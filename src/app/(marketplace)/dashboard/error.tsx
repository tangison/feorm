"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service in production
  }, [error]);

  return (
    <div className="flex-grow flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto px-6">
        <h2 className="font-serif-display text-2xl text-earth mb-3">Something went wrong</h2>
        <p className="text-sm text-muted-foreground mb-6">An unexpected error occurred.</p>
        <button
          onClick={reset}
          className="btn-primary-feorm px-6 py-3 text-xs uppercase tracking-widest"
          type="button"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

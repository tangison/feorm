"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Feorm Error Boundary]", error);
  }, [error]);

  const handleSystemReset = () => {
    // TODO: Replace with Supabase Auth — supabase.auth.signOut()
    window.location.href = "/";
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="min-h-screen flex items-center justify-center bg-fog px-6"
    >
      <div className="max-w-md w-full text-center space-y-8">
        {/* Alert Icon */}
        <div className="flex justify-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center bg-destructive/8"
          >
            <AlertTriangle
              className="w-10 h-10 text-destructive"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-serif-display text-4xl tracking-tight text-earth">
          Something Went Wrong
        </h1>

        {/* Body Copy */}
        <p className="text-base leading-relaxed text-muted-foreground">
          Something unexpected happened. Your booking and account details are safe.
        </p>

        {/* Error Digest — visible for debugging */}
        {error.digest && (
          <p className="font-mono-feorm text-xs text-sand">
            Ref: {error.digest}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={reset}
            className="btn-primary-feorm px-6 py-3 text-xs uppercase tracking-widest font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-harvest"
            aria-label="Try again — retry the failed operation"
            type="button"
          >
            Try Again
          </button>

          <button
            onClick={handleSystemReset}
            className="rounded-full px-6 py-3 text-xs uppercase tracking-widest font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive border border-destructive text-destructive hover:bg-destructive hover:text-white-feorm"
            aria-label="Start over — return to home page"
            type="button"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}

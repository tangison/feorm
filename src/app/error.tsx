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
    try {
      localStorage.removeItem("feorm-session");
    } catch {
      // localStorage may be unavailable in certain environments
    }
    window.location.href = "/";
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-6"
    >
      <div className="max-w-md w-full text-center space-y-8">
        {/* Alert Icon */}
        <div className="flex justify-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(159, 47, 45, 0.08)" }}
          >
            <AlertTriangle
              className="w-10 h-10"
              style={{ color: "#9F2F2D" }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Title */}
        <h1
          className="font-serif-display text-4xl tracking-tight"
          style={{ color: "#1E1A14" }}
        >
          System Interrupt
        </h1>

        {/* Body Copy */}
        <p
          className="text-base leading-relaxed"
          style={{ color: "#787774" }}
        >
          An unexpected condition has interrupted the Feorm network. Your session
          data has been preserved.
        </p>

        {/* Error Digest — visible for debugging */}
        {error.digest && (
          <p className="font-mono-feorm text-xs" style={{ color: "#D4C4A0" }}>
            Ref: {error.digest}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={reset}
            className="btn-primary-feorm px-6 py-3 text-xs uppercase tracking-widest font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8C96A]"
            aria-label="Attempt Recovery — retry the failed operation"
            type="button"
          >
            Attempt Recovery
          </button>

          <button
            onClick={handleSystemReset}
            className="rounded-full px-6 py-3 text-xs uppercase tracking-widest font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9F2F2D]"
            style={{
              backgroundColor: "transparent",
              border: "1px solid #9F2F2D",
              color: "#9F2F2D",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#9F2F2D";
              e.currentTarget.style.color = "#FEFDFB";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#9F2F2D";
            }}
            aria-label="System Reset — clear session and return to home"
            type="button"
          >
            System Reset
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("feorm_demo_banner_dismissed");
      if (stored === "true") {
        setDismissed(true);
      }
    } catch {
      // SSR or storage unavailable
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem("feorm_demo_banner_dismissed", "true");
    } catch {
      // storage unavailable
    }
  };

  if (dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-harvest text-earth h-[40px] flex items-center justify-center px-4">
      <p className="text-[11px] font-medium tracking-wide text-center">
        This is a live demo of the Feorm platform — all listings, images, and data are simulated.
      </p>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-earth/10 transition-colors"
        aria-label="Dismiss demo banner"
      >
        <X size={14} />
      </button>
    </div>
  );
}

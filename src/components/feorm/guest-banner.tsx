"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function GuestBanner() {
  // In demo mode, show a gentle nudge to explore instead of sign-in
  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-8 lg:max-w-sm z-30 bg-earth/95 backdrop-blur-xl rounded-2xl warm-shadow-lg border border-earth/10 safe-area-bottom">
      <div className="p-4 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-sand font-medium leading-snug">
            This is a demo — all data is simulated
          </p>
        </div>
        <Link
          href="/landing"
          className="shrink-0 bg-harvest text-earth px-4 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5 min-h-[44px] hover:brightness-90 transition-all active:scale-[0.98]"
        >
          Learn More
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

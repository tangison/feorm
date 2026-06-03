"use client";

import { useFeormAuth } from "@/context/feorm-context";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function GuestBanner() {
  const { user, loading } = useFeormAuth();

  // Don't show banner if user is logged in or still loading
  if (loading || user) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-4 left-4 right-4 lg:left-auto lg:right-8 lg:max-w-sm z-30 bg-earth/95 backdrop-blur-xl rounded-2xl shadow-lg shadow-earth/20 border border-earth/10 safe-area-bottom">
      <div className="p-4 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-sand font-medium leading-snug">
            Join Feorm to book stays and equipment
          </p>
        </div>
        <Link
          href="/auth"
          className="shrink-0 bg-harvest text-earth px-4 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5 min-h-[44px] hover:bg-harvest/90 transition-colors active:scale-[0.98]"
        >
          Sign In
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

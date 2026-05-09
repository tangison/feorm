"use client";

import React, { type ReactNode } from "react";

// ─── Import split context providers ─────────────────────────────
import { FeormAuthProvider } from "./feorm-auth";
import { FeormMarketProvider } from "./feorm-market";
import { FeormBookingProvider } from "./feorm-bookings";
import { FeormOnboardingProvider } from "./feorm-onboarding";

// ─── Re-export hooks directly from their source modules ──────────
// This avoids Turbopack re-export resolution issues
export { useFeormAuth } from "./feorm-auth";
export { useFeormMarket } from "./feorm-market";
export { useFeormBookings } from "./feorm-bookings";
export { useFeormOnboarding } from "./feorm-onboarding";

// ─── Re-export types ────────────────────────────────────────────
export type { Listing, MarketView } from "./feorm-market";
export type { Booking } from "./feorm-bookings";
export type { FeormUser } from "./feorm-auth";

/**
 * Composes all split context providers into a single provider tree.
 * Each provider is independent — consumers only re-render when the
 * specific context they subscribe to changes.
 */
export function FeormProvider({ children }: { children: ReactNode }) {
  return (
    <FeormAuthProvider>
      <FeormMarketProvider>
        <FeormBookingProvider>
          <FeormOnboardingProvider>
            {children}
          </FeormOnboardingProvider>
        </FeormBookingProvider>
      </FeormMarketProvider>
    </FeormAuthProvider>
  );
}

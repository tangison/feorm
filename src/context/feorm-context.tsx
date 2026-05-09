"use client";

import React, {
  createContext,
  useContext,
  type ReactNode,
} from "react";

// ─── Re-export split context hooks ──────────────────────────────
import { FeormAuthProvider, useFeormAuth } from "./feorm-auth";
import { FeormMarketProvider, useFeormMarket } from "./feorm-market";
import { FeormBookingProvider, useFeormBookings } from "./feorm-bookings";
import {
  FeormOnboardingProvider,
  useFeormOnboarding,
} from "./feorm-onboarding";

// ─── Re-export types ────────────────────────────────────────────
export type { Listing, MarketView } from "./feorm-market";
export type { Booking } from "./feorm-bookings";
export type { FeormUser } from "./feorm-auth";

// ─── Backward-compatible unified context ────────────────────────
// ⚠️ DISCOURAGED: Use specific hooks (useFeormAuth, useFeormMarket,
// useFeormBookings, useFeormOnboarding) instead. This unified hook
// causes unnecessary re-renders because any state change triggers
// all consumers. Kept for backward compatibility only.

interface FeormContextType {
  // Auth
  user: ReturnType<typeof useFeormAuth>["user"];
  setUser: ReturnType<typeof useFeormAuth>["setUser"];
  phone: ReturnType<typeof useFeormAuth>["phone"];
  setPhone: ReturnType<typeof useFeormAuth>["setPhone"];
  avatarUrl: ReturnType<typeof useFeormAuth>["avatarUrl"];
  setAvatarUrl: ReturnType<typeof useFeormAuth>["setAvatarUrl"];

  // Market
  marketView: ReturnType<typeof useFeormMarket>["marketView"];
  setMarketView: ReturnType<typeof useFeormMarket>["setMarketView"];
  listings: ReturnType<typeof useFeormMarket>["listings"];
  setListings: ReturnType<typeof useFeormMarket>["setListings"];
  selectedListing: ReturnType<typeof useFeormMarket>["selectedListing"];
  setSelectedListing: ReturnType<typeof useFeormMarket>["setSelectedListing"];

  // Bookings
  bookings: ReturnType<typeof useFeormBookings>["bookings"];
  setBookings: ReturnType<typeof useFeormBookings>["setBookings"];
  latestRef: ReturnType<typeof useFeormBookings>["latestRef"];
  setLatestRef: ReturnType<typeof useFeormBookings>["setLatestRef"];

  // Onboarding
  onboardingStep: ReturnType<typeof useFeormOnboarding>["onboardingStep"];
  setOnboardingStep: ReturnType<typeof useFeormOnboarding>["setOnboardingStep"];
  selectedRole: ReturnType<typeof useFeormOnboarding>["selectedRole"];
  setSelectedRole: ReturnType<typeof useFeormOnboarding>["setSelectedRole"];
  interests: ReturnType<typeof useFeormOnboarding>["interests"];
  setInterests: ReturnType<typeof useFeormOnboarding>["setInterests"];
  hasCompletedOnboarding: ReturnType<typeof useFeormOnboarding>["hasCompletedOnboarding"];
  setHasCompletedOnboarding: ReturnType<typeof useFeormOnboarding>["setHasCompletedOnboarding"];
  providerAssets: ReturnType<typeof useFeormOnboarding>["providerAssets"];
  setProviderAssets: ReturnType<typeof useFeormOnboarding>["setProviderAssets"];
}

const FeormContext = createContext<FeormContextType | null>(null);

/**
 * Internal component that reads all split contexts and combines them
 * into the legacy unified context for backward compatibility.
 */
function FeormContextAggregator({ children }: { children: ReactNode }) {
  const auth = useFeormAuth();
  const market = useFeormMarket();
  const bookings = useFeormBookings();
  const onboarding = useFeormOnboarding();

  return (
    <FeormContext.Provider
      value={{
        // Auth
        user: auth.user,
        setUser: auth.setUser,
        phone: auth.phone,
        setPhone: auth.setPhone,
        avatarUrl: auth.avatarUrl,
        setAvatarUrl: auth.setAvatarUrl,
        // Market
        marketView: market.marketView,
        setMarketView: market.setMarketView,
        listings: market.listings,
        setListings: market.setListings,
        selectedListing: market.selectedListing,
        setSelectedListing: market.setSelectedListing,
        // Bookings
        bookings: bookings.bookings,
        setBookings: bookings.setBookings,
        latestRef: bookings.latestRef,
        setLatestRef: bookings.setLatestRef,
        // Onboarding
        onboardingStep: onboarding.onboardingStep,
        setOnboardingStep: onboarding.setOnboardingStep,
        selectedRole: onboarding.selectedRole,
        setSelectedRole: onboarding.setSelectedRole,
        interests: onboarding.interests,
        setInterests: onboarding.setInterests,
        hasCompletedOnboarding: onboarding.hasCompletedOnboarding,
        setHasCompletedOnboarding: onboarding.setHasCompletedOnboarding,
        providerAssets: onboarding.providerAssets,
        setProviderAssets: onboarding.setProviderAssets,
      }}
    >
      {children}
    </FeormContext.Provider>
  );
}

/**
 * Composes all split context providers into a single provider tree.
 * Replaces the old monolithic FeormProvider while maintaining
 * backward compatibility via FeormContextAggregator.
 */
export function FeormProvider({ children }: { children: ReactNode }) {
  return (
    <FeormAuthProvider>
      <FeormMarketProvider>
        <FeormBookingProvider>
          <FeormOnboardingProvider>
            <FeormContextAggregator>
              {children}
            </FeormContextAggregator>
          </FeormOnboardingProvider>
        </FeormBookingProvider>
      </FeormMarketProvider>
    </FeormAuthProvider>
  );
}

/**
 * ⚠️ DISCOURAGED: This hook reads ALL context state, causing consumers
 * to re-render on ANY state change. Prefer the specific hooks:
 * - useFeormAuth() — user, phone, avatarUrl
 * - useFeormMarket() — marketView, listings, selectedListing
 * - useFeormBookings() — bookings, latestRef
 * - useFeormOnboarding() — onboardingStep, selectedRole, interests, etc.
 *
 * Kept for backward compatibility only.
 */
export function useFeorm() {
  const ctx = useContext(FeormContext);
  if (!ctx) {
    throw new Error("useFeorm must be used within a FeormProvider");
  }
  return ctx;
}

// ─── Export specific hooks for direct use ───────────────────────
export { useFeormAuth, useFeormMarket, useFeormBookings, useFeormOnboarding };

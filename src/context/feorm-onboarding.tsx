"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────
interface FeormOnboardingContextType {
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  selectedRole: "voyager" | "provider_stay" | null;
  setSelectedRole: (role: "voyager" | "provider_stay" | null) => void;
  interests: string[];
  setInterests: (interests: string[]) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
  providerAssets: ("stay")[];
  setProviderAssets: (assets: ("stay")[]) => void;
}

const FeormOnboardingContext = createContext<FeormOnboardingContextType | null>(
  null
);

export function FeormOnboardingProvider({
  children,
}: {
  children: ReactNode;
}) {
  // TODO: Replace with Supabase-backed state
  // Uses: supabase.from('profiles').select('role, interests, onboarding_completed, provider_assets')
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<"voyager" | "provider_stay" | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [providerAssets, setProviderAssets] = useState<("stay")[]>([]);

  return (
    <FeormOnboardingContext.Provider
      value={{
        onboardingStep,
        setOnboardingStep,
        selectedRole,
        setSelectedRole,
        interests,
        setInterests: useCallback((items: string[]) => setInterests(items), []),
        hasCompletedOnboarding,
        setHasCompletedOnboarding: useCallback((completed: boolean) => setHasCompletedOnboarding(completed), []),
        providerAssets,
        setProviderAssets: useCallback((assets: ("stay")[]) => setProviderAssets(assets), []),
      }}
    >
      {children}
    </FeormOnboardingContext.Provider>
  );
}

export function useFeormOnboarding() {
  const ctx = useContext(FeormOnboardingContext);
  if (!ctx) {
    throw new Error(
      "useFeormOnboarding must be used within a FeormOnboardingProvider"
    );
  }
  return ctx;
}

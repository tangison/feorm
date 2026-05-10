"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────
interface FeormOnboardingContextType {
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  selectedRole: "voyager" | "provider" | null;
  setSelectedRole: (role: "voyager" | "provider" | null) => void;
  interests: string[];
  setInterests: (interests: string[]) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
  providerAssets: ("stay" | "equipment")[];
  setProviderAssets: (assets: ("stay" | "equipment")[]) => void;
}

const FeormOnboardingContext = createContext<FeormOnboardingContextType | null>(
  null
);

function loadOnboardingSession(): {
  selectedRole: "voyager" | "provider" | null;
  interests: string[];
  hasCompletedOnboarding: boolean;
  providerAssets: ("stay" | "equipment")[];
} {
  if (typeof window === "undefined")
    return {
      selectedRole: null,
      interests: [],
      hasCompletedOnboarding: false,
      providerAssets: [],
    };
  try {
    const saved = localStorage.getItem("feorm-session");
    if (saved) {
      const session = JSON.parse(saved);
      return {
        selectedRole: session.selectedRole || null,
        interests: session.interests || [],
        hasCompletedOnboarding: session.hasCompletedOnboarding || false,
        providerAssets: session.providerAssets || [],
      };
    }
  } catch {
    // Ignore localStorage errors
  }
  return {
    selectedRole: null,
    interests: [],
    hasCompletedOnboarding: false,
    providerAssets: [],
  };
}

export function FeormOnboardingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [session] = useState(loadOnboardingSession);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<"voyager" | "provider" | null>(
    session.selectedRole
  );
  const [interests, setInterests] = useState<string[]>(session.interests);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(
    session.hasCompletedOnboarding
  );
  const [providerAssets, setProviderAssets] = useState<("stay" | "equipment")[]>(
    session.providerAssets
  );

  // Persist onboarding state to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("feorm-session");
      const session = saved ? JSON.parse(saved) : {};
      localStorage.setItem(
        "feorm-session",
        JSON.stringify({
          ...session,
          selectedRole,
          interests,
          hasCompletedOnboarding,
          providerAssets,
        })
      );
    } catch {
      // Ignore localStorage errors
    }
  }, [selectedRole, interests, hasCompletedOnboarding, providerAssets]);

  return (
    <FeormOnboardingContext.Provider
      value={{
        onboardingStep,
        setOnboardingStep,
        selectedRole,
        setSelectedRole,
        interests,
        setInterests,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
        providerAssets,
        setProviderAssets,
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

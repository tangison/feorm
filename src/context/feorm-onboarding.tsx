"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useSyncExternalStore,
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

interface OnboardingState {
  selectedRole: "voyager" | "provider" | null;
  interests: string[];
  hasCompletedOnboarding: boolean;
  providerAssets: ("stay" | "equipment")[];
}

const FeormOnboardingContext = createContext<FeormOnboardingContextType | null>(
  null
);

// Server-safe defaults — must match what SSR produces
const SERVER_DEFAULTS: OnboardingState = {
  selectedRole: null,
  interests: [],
  hasCompletedOnboarding: false,
  providerAssets: [],
};

const STORAGE_KEY = "feorm-session";
let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): OnboardingState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
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
  return SERVER_DEFAULTS;
}

function getServerSnapshot(): OnboardingState {
  return SERVER_DEFAULTS;
}

function persistToStorage(patch: Partial<OnboardingState>) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const session = saved ? JSON.parse(saved) : {};
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...session, ...patch })
    );
    emitChange();
  } catch {
    // Ignore localStorage errors
  }
}

export function FeormOnboardingProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Sync from localStorage — uses server snapshot during SSR
  const persisted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const [onboardingStep, setOnboardingStep] = useState(0);
  const [selectedRole, setSelectedRoleRaw] = useState<"voyager" | "provider" | null>(
    persisted.selectedRole
  );
  const [interests, setInterestsRaw] = useState<string[]>(persisted.interests);
  const [hasCompletedOnboarding, setHasCompletedOnboardingRaw] = useState(
    persisted.hasCompletedOnboarding
  );
  const [providerAssets, setProviderAssetsRaw] = useState<("stay" | "equipment")[]>(
    persisted.providerAssets
  );

  const setSelectedRole = useCallback((role: "voyager" | "provider" | null) => {
    setSelectedRoleRaw(role);
    persistToStorage({ selectedRole: role });
  }, []);

  const setInterests = useCallback((items: string[]) => {
    setInterestsRaw(items);
    persistToStorage({ interests: items });
  }, []);

  const setHasCompletedOnboarding = useCallback((completed: boolean) => {
    setHasCompletedOnboardingRaw(completed);
    persistToStorage({ hasCompletedOnboarding: completed });
  }, []);

  const setProviderAssets = useCallback((assets: ("stay" | "equipment")[]) => {
    setProviderAssetsRaw(assets);
    persistToStorage({ providerAssets: assets });
  }, []);

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

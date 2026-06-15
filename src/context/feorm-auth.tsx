"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { getDemoUser, type DemoUser } from "@/lib/demo-data";

// ─── Types ────────────────────────────────────────────────────────
interface FeormUser {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  surname?: string;
  region?: string;
  role: "guest" | "voyager" | "provider_stay" | "admin";
  verified: boolean;
  avatarUrl?: string;
  interests?: string[];
  hasCompletedOnboarding?: boolean;
}

type DemoPersona = "farmer" | "guest";

interface FeormAuthContextType {
  user: FeormUser | null;
  avatarUrl: string;
  loading: boolean;
  persona: DemoPersona;
  setPersona: (p: DemoPersona) => void;
  setAvatarUrl: (url: string) => void;
}

const FeormAuthContext = createContext<FeormAuthContextType | null>(null);

function mapDemoUser(demo: DemoUser): FeormUser {
  return {
    id: demo.id,
    email: demo.email,
    phone: demo.phone,
    name: demo.name,
    surname: demo.surname,
    region: demo.region,
    role: demo.role,
    verified: demo.verified,
    avatarUrl: demo.avatarUrl,
    hasCompletedOnboarding: true,
  };
}

function getInitialPersona(): DemoPersona {
  if (typeof window === "undefined") return "guest";
  try {
    const stored = localStorage.getItem("feorm_demo_persona");
    if (stored === "farmer" || stored === "guest") return stored;
  } catch {
    // SSR or storage unavailable
  }
  return "guest";
}

export function FeormAuthProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<DemoPersona>(getInitialPersona);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(() => {
    // If we're on the server, we're still loading
    if (typeof window === "undefined") return true;
    // On client, we synchronously initialized persona above
    return false;
  });

  // Derive user from persona — no effect needed
  const user = useMemo(() => {
    const demoUser = getDemoUser(persona);
    return mapDemoUser(demoUser);
  }, [persona]);

  // Derive avatarUrl from persona or custom override
  const avatarUrl = useMemo(() => {
    if (customAvatarUrl !== null) return customAvatarUrl;
    return getDemoUser(persona).avatarUrl;
  }, [persona, customAvatarUrl]);

  const setPersona = useCallback((p: DemoPersona) => {
    setPersonaState(p);
    setCustomAvatarUrl(null); // Reset custom avatar when switching persona
    try {
      localStorage.setItem("feorm_demo_persona", p);
    } catch {
      // storage unavailable
    }
  }, []);

  const setAvatarUrl = useCallback((url: string) => {
    setCustomAvatarUrl(url);
  }, []);

  // Handle hydration: mark loading as false after mount
  // Using a ref-based approach to avoid the setState-in-effect lint
  const [mounted, setMounted] = useState(false);
  if (!mounted && typeof window !== "undefined") {
    // Client-side first render — we have the persona already
    setMounted(true);
    if (loading) setLoading(false);
  }

  return (
    <FeormAuthContext.Provider
      value={{
        user,
        avatarUrl,
        loading,
        persona,
        setPersona,
        setAvatarUrl,
      }}
    >
      {children}
    </FeormAuthContext.Provider>
  );
}

export function useFeormAuth() {
  const ctx = useContext(FeormAuthContext);
  if (!ctx) {
    throw new Error("useFeormAuth must be used within a FeormAuthProvider");
  }
  return ctx;
}

export type { FeormUser, DemoPersona };

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
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

export function FeormAuthProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<DemoPersona>("guest");
  const [user, setUser] = useState<FeormUser | null>(null);
  const [avatarUrl, setAvatarUrlState] = useState("");
  const [loading, setLoading] = useState(true);

  // Load persona from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("feorm_demo_persona");
      if (stored === "farmer" || stored === "guest") {
        setPersonaState(stored);
      }
    } catch {
      // SSR or storage unavailable
    }
    setLoading(false);
  }, []);

  // Update user when persona changes
  useEffect(() => {
    const demoUser = getDemoUser(persona);
    const feormUser = mapDemoUser(demoUser);
    setUser(feormUser);
    setAvatarUrlState(demoUser.avatarUrl);
  }, [persona]);

  const setPersona = useCallback((p: DemoPersona) => {
    setPersonaState(p);
    try {
      localStorage.setItem("feorm_demo_persona", p);
    } catch {
      // storage unavailable
    }
  }, []);

  const setAvatarUrl = useCallback((url: string) => {
    setAvatarUrlState(url);
  }, []);

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

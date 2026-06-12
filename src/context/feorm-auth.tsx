"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { DEMO_USER, type DemoProfile } from "@/lib/demo-data";

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

interface FeormAuthContextType {
  user: FeormUser | null;
  email: string;
  phone: string;
  avatarUrl: string;
  setUser: React.Dispatch<React.SetStateAction<FeormUser | null>>;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  setAvatarUrl: (url: string) => void;
  loading: boolean;
}

const FeormAuthContext = createContext<FeormAuthContextType | null>(null);

const STORAGE_KEY = "feorm-demo-user";

// ─── Helper: convert DemoProfile to FeormUser ─────────────────────
function demoToUser(profile: DemoProfile): FeormUser {
  return {
    id: profile.id,
    email: profile.email,
    phone: profile.phone,
    name: profile.name,
    surname: profile.surname,
    region: profile.region,
    role: profile.role,
    verified: profile.verified,
    avatarUrl: profile.avatarUrl,
    hasCompletedOnboarding: !!profile.name && !!profile.role && profile.role !== "guest",
  };
}

// ─── Helper: persist user to localStorage ─────────────────────────
function persistUser(user: FeormUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// ─── Helper: load user from localStorage (client only) ───────────
function loadPersistedUser(): FeormUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as FeormUser;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

// ─── Client-safe initialization ───────────────────────────────────
// This function is used as a lazy initializer for useState.
// On the server it returns null. On the client it checks localStorage.
function getInitialUser(): FeormUser | null {
  if (typeof window === "undefined") return null;
  const persisted = loadPersistedUser();
  if (persisted) return persisted;
  const demo = demoToUser(DEMO_USER);
  persistUser(demo);
  return demo;
}

export function FeormAuthProvider({ children }: { children: ReactNode }) {
  // Demo mode: user is loaded synchronously from localStorage via lazy init.
  // On SSR, user is null. On client, user is immediately available.
  // No async loading needed — no Supabase session to wait for.
  const [user, setUser] = useState<FeormUser | null>(getInitialUser);

  // ─── Persist user on change ────────────────────────────────────
  useEffect(() => {
    if (user) {
      persistUser(user);
    }
  }, [user]);

  // Derive email/phone/avatarUrl from user to keep in sync
  const email = user?.email ?? "";
  const phone = user?.phone ?? "";
  const avatarUrl = user?.avatarUrl ?? "";

  const setEmailCallback = useCallback((value: string) => {
    setUser((prev) => prev ? { ...prev, email: value } : prev);
  }, []);

  const setPhoneCallback = useCallback((value: string) => {
    setUser((prev) => prev ? { ...prev, phone: value } : prev);
  }, []);

  const setAvatarUrlCallback = useCallback((value: string) => {
    setUser((prev) => prev ? { ...prev, avatarUrl: value } : prev);
  }, []);

  // In demo mode, loading is always false since there's no async auth
  const loading = false;

  const value = useMemo(() => ({
    user,
    email,
    phone,
    avatarUrl,
    setUser,
    setEmail: setEmailCallback,
    setPhone: setPhoneCallback,
    setAvatarUrl: setAvatarUrlCallback,
    loading,
  }), [user, email, phone, avatarUrl, loading, setEmailCallback, setPhoneCallback, setAvatarUrlCallback]);

  return (
    <FeormAuthContext.Provider value={value}>
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

// ─── Demo sign-in helper ──────────────────────────────────────────
export function demoSignIn(profile?: DemoProfile) {
  const p = profile || DEMO_USER;
  const user = demoToUser(p);
  persistUser(user);
  return user;
}

// ─── Demo sign-out helper ─────────────────────────────────────────
export function demoSignOut() {
  persistUser(null);
}

export type { FeormUser };

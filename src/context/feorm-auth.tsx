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
interface FeormUser {
  id: string;
  phone: string;
  name?: string;
  surname?: string;
  region?: string;
  role: "explorer" | "lister" | "voyager" | "provider";
  verified: boolean;
  avatarUrl?: string;
  interests?: string[];
  hasCompletedOnboarding?: boolean;
}

interface FeormAuthState {
  user: FeormUser | null;
  phone: string;
  avatarUrl: string;
}

interface FeormAuthContextType extends FeormAuthState {
  setUser: React.Dispatch<React.SetStateAction<FeormUser | null>>;
  setPhone: (phone: string) => void;
  setAvatarUrl: (url: string) => void;
}

const FeormAuthContext = createContext<FeormAuthContextType | null>(null);

// Server-safe defaults — must match what SSR produces
const SERVER_DEFAULTS: FeormAuthState = {
  user: null,
  phone: "",
  avatarUrl: "",
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

function getSnapshot(): FeormAuthState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const session = JSON.parse(saved);
      return {
        user: session.user || null,
        phone: session.phone || "",
        avatarUrl: session.avatarUrl || "",
      };
    }
  } catch {
    // Ignore localStorage errors
  }
  return SERVER_DEFAULTS;
}

function getServerSnapshot(): FeormAuthState {
  return SERVER_DEFAULTS;
}

function persistToStorage(state: FeormAuthState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    emitChange();
  } catch {
    // Ignore localStorage errors
  }
}

export function FeormAuthProvider({ children }: { children: ReactNode }) {
  // Sync from localStorage — uses server snapshot during SSR, client snapshot after hydration
  const persisted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Local state tracks both persisted + transient overrides
  const [user, setUserRaw] = useState<FeormUser | null>(persisted.user);
  const [phone, setPhoneRaw] = useState(persisted.phone);
  const [avatarUrl, setAvatarUrlRaw] = useState(persisted.avatarUrl);

  const setUser = useCallback(
    (action: React.SetStateAction<FeormUser | null>) => {
      setUserRaw((prev) => {
        const next = typeof action === "function" ? action(prev) : action;
        persistToStorage({ user: next, phone, avatarUrl });
        return next;
      });
    },
    [phone, avatarUrl]
  );

  const setPhone = useCallback((value: string) => {
    setPhoneRaw(value);
    // Read current user/avatarUrl from state at call time isn't possible,
    // so we read from localStorage for the other fields
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const session = saved ? JSON.parse(saved) : {};
      persistToStorage({ ...session, user: session.user || null, phone: value, avatarUrl: session.avatarUrl || "" });
    } catch {
      persistToStorage({ user: null, phone: value, avatarUrl: "" });
    }
  }, []);

  const setAvatarUrl = useCallback((value: string) => {
    setAvatarUrlRaw(value);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const session = saved ? JSON.parse(saved) : {};
      persistToStorage({ ...session, user: session.user || null, phone: session.phone || "", avatarUrl: value });
    } catch {
      persistToStorage({ user: null, phone: "", avatarUrl: value });
    }
  }, []);

  return (
    <FeormAuthContext.Provider
      value={{ user, phone, avatarUrl, setUser, setPhone, setAvatarUrl }}
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

export type { FeormUser };

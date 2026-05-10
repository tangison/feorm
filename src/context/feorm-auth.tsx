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
const SERVER_DEFAULTS: FeormAuthState = Object.freeze({
  user: null,
  phone: "",
  avatarUrl: "",
});

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

// ─── Cached snapshot to prevent infinite loops ──────────────────
// useSyncExternalStore requires getSnapshot to return the same
// reference when data hasn't changed. Without caching, every call
// creates a new object → React detects a change → infinite re-render.
let cachedRaw: string | null = null;
let cachedSnapshot: FeormAuthState = SERVER_DEFAULTS;

function getSnapshot(): FeormAuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedSnapshot;

    if (raw) {
      const session = JSON.parse(raw);
      cachedSnapshot = {
        user: session.user || null,
        phone: session.phone || "",
        avatarUrl: session.avatarUrl || "",
      };
    } else {
      cachedSnapshot = { ...SERVER_DEFAULTS };
    }
    cachedRaw = raw;
    return cachedSnapshot;
  } catch {
    return cachedSnapshot;
  }
}

function getServerSnapshot(): FeormAuthState {
  return SERVER_DEFAULTS;
}

function persistToStorage(state: FeormAuthState) {
  try {
    const json = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, json);
    // Invalidate cache so next getSnapshot() returns fresh data
    cachedRaw = json;
    cachedSnapshot = state;
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

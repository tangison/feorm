"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
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

interface FeormAuthContextType {
  user: FeormUser | null;
  setUser: React.Dispatch<React.SetStateAction<FeormUser | null>>;
  phone: string;
  setPhone: (phone: string) => void;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
}

const FeormAuthContext = createContext<FeormAuthContextType | null>(null);

function loadAuthSession(): {
  user: FeormUser | null;
  phone: string;
  avatarUrl: string;
} {
  if (typeof window === "undefined")
    return { user: null, phone: "", avatarUrl: "" };
  try {
    const saved = localStorage.getItem("feorm-session");
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
  return { user: null, phone: "", avatarUrl: "" };
}

export function FeormAuthProvider({ children }: { children: ReactNode }) {
  const [session] = useState(loadAuthSession);
  const [user, setUser] = useState<FeormUser | null>(session.user);
  const [phone, setPhone] = useState(session.phone);
  const [avatarUrl, setAvatarUrl] = useState(session.avatarUrl);

  // Persist auth state to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("feorm-session");
      const session = saved ? JSON.parse(saved) : {};
      localStorage.setItem(
        "feorm-session",
        JSON.stringify({
          ...session,
          user,
          phone,
          avatarUrl,
        })
      );
    } catch {
      // Ignore localStorage errors
    }
  }, [user, phone, avatarUrl]);

  return (
    <FeormAuthContext.Provider
      value={{ user, setUser, phone, setPhone, avatarUrl, setAvatarUrl }}
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

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";

// ─── Types ────────────────────────────────────────────────────────
interface FeormUser {
  id: string;
  email?: string;
  phone?: string;
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
  email: string;
  phone: string;
  avatarUrl: string;
}

interface FeormAuthContextType extends FeormAuthState {
  setUser: React.Dispatch<React.SetStateAction<FeormUser | null>>;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  setAvatarUrl: (url: string) => void;
  loading: boolean;
}

const FeormAuthContext = createContext<FeormAuthContextType | null>(null);

// ─── Default state ────────────────────────────────────────────────
const DEFAULTS: FeormAuthState = Object.freeze({
  user: null,
  email: "",
  phone: "",
  avatarUrl: "",
});

export function FeormAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FeormUser | null>(DEFAULTS.user);
  const [email, setEmail] = useState(DEFAULTS.email);
  const [phone, setPhone] = useState(DEFAULTS.phone);
  const [avatarUrl, setAvatarUrl] = useState(DEFAULTS.avatarUrl);
  const [loading, setLoading] = useState(true);

  // ─── Subscribe to Supabase Auth state changes ─────────────────
  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata ?? {};
        setEmail(session.user.email ?? meta.email ?? "");
        setPhone(session.user.phone ?? meta.phone ?? "");

        // Fetch profile from our API
        fetch("/api/auth?action=me")
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.user) {
              const profile = data.user;
              setUser({
                id: profile.id,
                email: session.user.email,
                phone: profile.phone,
                name: profile.name,
                surname: profile.surname,
                region: profile.region,
                role: profile.role ?? "explorer",
                verified: profile.verified ?? false,
                avatarUrl: profile.avatarUrl ?? profile.avatar_url,
                hasCompletedOnboarding: !!profile.name && !!profile.role && profile.role !== "explorer",
              });
              if (profile.phone) setPhone(profile.phone);
              if (profile.avatarUrl ?? profile.avatar_url) {
                setAvatarUrl(profile.avatarUrl ?? profile.avatar_url);
              }
            }
          })
          .catch(console.error)
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata ?? {};
        setEmail(session.user.email ?? meta.email ?? "");
        setPhone(session.user.phone ?? meta.phone ?? "");

        // Fetch profile on auth change
        fetch("/api/auth?action=me")
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.user) {
              const profile = data.user;
              setUser({
                id: profile.id,
                email: session.user.email,
                phone: profile.phone,
                name: profile.name,
                surname: profile.surname,
                region: profile.region,
                role: profile.role ?? "explorer",
                verified: profile.verified ?? false,
                avatarUrl: profile.avatarUrl ?? profile.avatar_url,
                hasCompletedOnboarding: !!profile.name && !!profile.role && profile.role !== "explorer",
              });
              if (profile.phone) setPhone(profile.phone);
              if (profile.avatarUrl ?? profile.avatar_url) {
                setAvatarUrl(profile.avatarUrl ?? profile.avatar_url);
              }
            }
          })
          .catch(console.error);
      } else {
        setUser(null);
        setEmail("");
        setPhone("");
        setAvatarUrl("");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setEmailCallback = useCallback((value: string) => {
    setEmail(value);
  }, []);

  const setPhoneCallback = useCallback((value: string) => {
    setPhone(value);
  }, []);

  const setAvatarUrlCallback = useCallback((value: string) => {
    setAvatarUrl(value);
  }, []);

  return (
    <FeormAuthContext.Provider
      value={{
        user,
        email,
        phone,
        avatarUrl,
        setUser,
        setEmail: setEmailCallback,
        setPhone: setPhoneCallback,
        setAvatarUrl: setAvatarUrlCallback,
        loading,
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

export type { FeormUser };

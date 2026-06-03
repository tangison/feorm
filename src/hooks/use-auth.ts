"use client";

import { useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

// Auth hook — Supabase Auth integration (Email Magic Link)
export function useAuthMutations() {
  const requestMagicLink = useCallback(async (email: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Magic link request failed" };
    }
  }, []);

  const setupIdentity = useCallback(
    async (data: {
      userId: string;
      name: string;
      surname?: string;
      phone?: string;
      region: string;
      role: string;
    }) => {
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "setup-identity", ...data }),
        });
        const result = await res.json();
        return result;
      } catch (error: any) {
        return { success: false, error: error.message || "Identity setup failed" };
      }
    },
    []
  );

  const verifyUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "me" }),
      });
      const data = await res.json();
      if (data.user) {
        return { success: true, user: data.user };
      }
      return { success: false, error: "Not authenticated" };
    } catch (error: any) {
      return { success: false, error: error.message || "Verification failed" };
    }
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  }, []);

  return { requestMagicLink, setupIdentity, verifyUser, signOut };
}

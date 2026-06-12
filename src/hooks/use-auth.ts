"use client";

import { useCallback } from "react";
import { DEMO_USER, type DemoProfile } from "@/lib/demo-data";

/**
 * Auth hook — Demo mode
 *
 * All Supabase calls replaced with demo implementations.
 * "Sign in" auto-authenticates as the demo user.
 * "Sign out" clears the demo session from localStorage.
 */

function demoProfileToUser(profile: DemoProfile) {
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
  };
}

export function useAuthMutations() {
  const requestMagicLink = useCallback(async (_email: string) => {
    // Demo mode: always succeeds, auto-signs in
    return { success: true };
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
    // Demo mode: always returns the demo user
    return { success: true, user: demoProfileToUser(DEMO_USER) };
  }, []);

  const signOut = useCallback(async () => {
    // Clear demo session from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("feorm-demo-user");
    }
  }, []);

  return { requestMagicLink, setupIdentity, verifyUser, signOut };
}

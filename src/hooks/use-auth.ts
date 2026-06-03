"use client";

import { useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

// Auth hook — Supabase Auth integration
export function useAuthMutations() {
  const requestOtp = useCallback(async (phone: string) => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request-otp", phone }),
      });
      const data = await res.json();
      return data;
    } catch (error: any) {
      return { success: false, error: error.message || "OTP request failed" };
    }
  }, []);

  const verifyOtp = useCallback(async (phone: string, otp: string) => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-otp", phone, otp }),
      });
      const data = await res.json();
      return data;
    } catch (error: any) {
      return { success: false, error: error.message || "Verification failed" };
    }
  }, []);

  const setupIdentityMut = useCallback(
    async (data: {
      phone: string;
      name: string;
      surname: string;
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

  const verifyUser = useCallback(async (phone: string) => {
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

  return { requestOtp, verifyOtp, setupIdentity: setupIdentityMut, verifyUser, signOut };
}

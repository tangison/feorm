"use client";

import { useCallback } from "react";

// Auth hook — REST API primary with demo mode fallback
export function useAuthMutations() {
  const verifyOtp = useCallback(async (phone: string, otp: string) => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-otp", phone, otp }),
      });
      return await res.json();
    } catch {
      // Demo mode fallback: accept 123456 for any phone
      if (otp === "123456") {
        return {
          success: true,
          userId: "demo-user",
          isNewUser: true,
          phone,
        };
      }
      return { success: false, error: "Invalid OTP. Demo: use 123456" };
    }
  }, []);

  const setupIdentity = useCallback(
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
        return await res.json();
      } catch {
        // Demo mode: just succeed
        return { success: true, user: data };
      }
    },
    []
  );

  const verifyUser = useCallback(async (phone: string) => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "me", phone }),
      });
      return await res.json();
    } catch {
      // Demo mode: just succeed
      return { success: true };
    }
  }, []);

  return { verifyOtp, setupIdentity, verifyUser };
}

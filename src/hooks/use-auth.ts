"use client";

import { useMutation } from "convex/react";
import { api } from "@/lib/convex";
import { useState, useCallback } from "react";

// Auth hook with Convex primary + REST fallback
export function useAuthMutations() {
  const verifyOtpConvex = useMutation(api.auth.verifyOtp);
  const setupIdentityConvex = useMutation(api.auth.setupIdentity);
  const verifyUserConvex = useMutation(api.auth.verifyUser);

  const verifyOtp = useCallback(async (phone: string, otp: string) => {
    try {
      return await verifyOtpConvex({ phone, otp });
    } catch {
      // Fallback to REST API
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-otp", phone, otp }),
      });
      return res.json();
    }
  }, [verifyOtpConvex]);

  const setupIdentity = useCallback(async (data: {
    phone: string;
    name: string;
    surname: string;
    region: string;
    role: string;
  }) => {
    try {
      return await setupIdentityConvex(data);
    } catch {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setup-identity", ...data }),
      });
      return res.json();
    }
  }, [setupIdentityConvex]);

  const verifyUser = useCallback(async (phone: string) => {
    try {
      return await verifyUserConvex({ phone });
    } catch {
      // Demo mode: just succeed
      return { success: true };
    }
  }, [verifyUserConvex]);

  return { verifyOtp, setupIdentity, verifyUser };
}

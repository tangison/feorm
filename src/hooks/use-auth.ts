"use client";

import { useCallback } from "react";

// Auth hook — Demo mode (no real auth)
export function useAuthMutations() {
  const signOut = useCallback(async () => {
    // Demo mode — just reset persona
    try {
      localStorage.removeItem("feorm_demo_persona");
      localStorage.removeItem("feorm_demo_banner_dismissed");
    } catch { /* ignore */ }
    window.location.href = "/";
  }, []);

  return { signOut };
}

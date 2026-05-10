"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// Create Convex client lazily — only if URL is available
let convex: ConvexReactClient | null = null;
if (convexUrl) {
  convex = new ConvexReactClient(convexUrl);
}

export function ConvexProviderWrapper({ children }: { children: ReactNode }) {
  if (!convex) {
    // If Convex URL is not configured, render without provider
    // Pages will fall back to REST API routes
    return <>{children}</>;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

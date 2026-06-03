---
Task ID: 1-6
Agent: Main Agent
Task: Refactor Feorm codebase — 6-task cleanup for Supabase migration prep

Work Log:
- TASK 1: Rewrote src/lib/ai-providers.ts — removed Groq, Gemini, z-ai SDK. Only OpenRouter remains. Single env var: OPENROUTER_API_KEY. Throws clear error if missing.
- TASK 2: Emptied DEMO_STAYS, DEMO_EQUIPMENT, ALL_DEMO, DEMO_BOOKINGS. Replaced all try/catch demo fallbacks with thrown errors. Removed hardcoded OTP "123456". Removed hardcoded userId "demo-user". Replaced hardcoded WhatsApp number with listing.hostPhone. Replaced hardcoded escrow N$1500 with Math.max(50000, Math.round(subtotal * 0.1)).
- TASK 3: Added 10 semantic color tokens to globals.css @theme inline and :root. Replaced 42 hardcoded hex colors across 16 files with Tailwind token classes (verified, verified-bg, destructive-bg, whatsapp, machinery, etc.).
- TASK 4: Removed @prisma/client and prisma from dependencies. Removed z-ai-web-dev-sdk from chat (kept for avatar image generation). Renamed package.json name from "nextjs_tailwind_shadcn_ts" to "feorm". Removed prisma db scripts.
- TASK 5: Replaced src/lib/db.ts with Supabase placeholder functions (getListings, getListingById, createListing, getBookings, createBooking, findOrCreateUser, updateUser, verifyOtp). Each throws "Not implemented — awaiting Supabase setup" with table and operation details. Updated API routes to remove demo fallbacks.
- TASK 6: Created src/lib/auth.ts with placeholder functions (getSession, signOut, requestOtp, verifyOtpCode, setupIdentity). Rewrote feorm-auth.tsx and feorm-onboarding.tsx to remove all localStorage logic. Updated use-auth.ts hook. Removed all localStorage.removeItem/setItem/getItem calls across nav, profile, settings, and error pages.

Stage Summary:
- 25+ files modified across the 6 tasks
- All demo/hardcoded data stripped — app will fail visibly, not silently
- All auth is placeholder — ready for Supabase Auth wiring
- All DB calls are placeholder — every function shows exact table and operation needed
- Color token system complete — 10 semantic tokens added, 42 hardcoded hex replacements
- AI providers simplified — single OpenRouter provider, single env var
- Package.json cleaned — renamed to "feorm", Prisma removed, db scripts removed

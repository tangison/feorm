# Task 7-8: User Roles & Onboarding Flows

## Summary
Implemented comprehensive user role system and onboarding flows for the Feorm platform.

## Changes Made

### Context Updates
- `src/context/feorm-auth.tsx`: Changed FeormUser role type from `"explorer" | "lister" | "voyager" | "provider"` to `"guest" | "voyager" | "provider_stay" | "admin"`. Default role changed from `"explorer"` to `"guest"`.
- `src/context/feorm-onboarding.tsx`: Changed selectedRole type from `"voyager" | "provider" | null` to `"voyager" | "provider_stay" | null`.

### Task 7A — Guest Mode
- `src/components/feorm/guest-banner.tsx` (NEW): Guest banner component shown at bottom when user is not logged in, with "Sign In" button.
- `src/app/(marketplace)/layout.tsx` (MODIFIED): Added GuestBanner component.
- `src/app/(marketplace)/listing/[id]/page.tsx` (MODIFIED): Added auth check on Book Now/WhatsApp buttons — redirects to `/auth?message=sign-in-to-book` for unauthenticated users.
- `src/app/(auth)/auth/page.tsx` (MODIFIED): Added Suspense wrapper and sign-in message display when redirected from listing page.
- Middleware already allows unauthenticated access to marketplace/listing pages.

### Task 7B — Voyager Onboarding
- `src/app/(auth)/auth/voyager/profile/page.tsx` (NEW): Personal info form with name, phone, region, profile photo. Full-bleed background with gradient overlay.
- `src/app/(auth)/auth/voyager/interests/page.tsx` (MODIFIED): Updated with region multi-select, full-bleed background styling, and "Start Exploring" CTA.

### Task 7C — Provider Stay Onboarding
- `src/app/(auth)/auth/provider/stay/profile/page.tsx` (NEW): About You form with name, phone (required), farm name, region.
- `src/app/(auth)/auth/provider/stay/property/page.tsx` (NEW): Property details with stay type selection, capacity, description, GPS coordinates.
- `src/app/(auth)/auth/provider/stay/verify/page.tsx` (NEW): Verification notice with pending status, requirements checklist.

### Task 7D — Admin Role
- `src/app/api/admin/route.ts` (NEW): Admin API with GET (pending verifications, stats, all listings) and POST (approve/reject provider).
- `src/app/(marketplace)/admin/page.tsx` (NEW): Admin dashboard with pending verifications list, approve/reject buttons, stats cards.

### Task 8 — Visual Requirements
- All onboarding pages use full-bleed background images with dark gradient overlay.
- Semi-transparent white card styling: `rgba(255,255,255,0.12)` background, `rgba(255,255,255,0.2)` border, `backdrop-filter: blur(8px)`.
- Harvest gold (#C4933A) CTA buttons, full width, rounded.
- Progress dots on each onboarding step.
- Back button on steps 2+.
- Feorm logo at top center.

### Updated Pages
- `src/app/(auth)/auth/role/page.tsx` (MODIFIED): 3 role cards instead of 2, proper routing to new onboarding flows.
- `src/app/auth/callback/route.ts` (MODIFIED): Redirects new users to `/auth/role` instead of `/auth/identity`.
- `src/components/feorm/nav.tsx` (MODIFIED): Updated role checks for new role types, added Admin tab when role is admin.
- `src/lib/db.ts` (MODIFIED): Changed default role from "explorer" to "guest".
- `src/app/(auth)/auth/identity/page.tsx` (MODIFIED): Changed default role from "explorer" to "guest".

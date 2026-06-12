/**
 * Feorm Auth — Demo Mode
 *
 * All Supabase Auth calls replaced with demo implementations.
 * The demo user is always authenticated.
 */

import { DEMO_USER, getProfileById, type DemoProfile } from "@/lib/demo-data";

// ─── Server-side Auth (demo) ────────────────────────────────────

/** Demo: always succeeds */
export async function requestMagicLink(
  _email: string
): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

/** Demo: no-op */
export async function exchangeCodeForSession(_code: string) {
  return { user: DEMO_USER };
}

/** Demo: always returns a fake session */
export async function getSession() {
  return {
    access_token: "demo-token",
    user: { id: DEMO_USER.id, email: DEMO_USER.email },
  };
}

/** Demo: returns the demo user profile */
export async function getCurrentUser() {
  return {
    id: DEMO_USER.id,
    email: DEMO_USER.email,
    phone: DEMO_USER.phone,
    name: DEMO_USER.name,
    surname: DEMO_USER.surname,
    region: DEMO_USER.region,
    role: DEMO_USER.role,
    verified: DEMO_USER.verified,
    avatarUrl: DEMO_USER.avatarUrl,
  };
}

/** Demo: no-op (returns success) */
export async function signOut() {
  return;
}

/** Demo: updates user identity (returns the updated user) */
export async function setupIdentity(data: {
  userId: string;
  name: string;
  surname?: string;
  phone?: string;
  region: string;
  role: string;
}) {
  return {
    id: data.userId,
    name: data.name,
    surname: data.surname,
    phone: data.phone,
    region: data.region,
    role: data.role,
    verified: true,
  };
}

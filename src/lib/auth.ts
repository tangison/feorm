/**
 * Feorm Auth — Supabase Auth Integration (Email Magic Link)
 *
 * Uses: supabase.auth.signInWithOtp({ email })
 * Uses: supabase.auth.getSession()
 * Uses: supabase.auth.signOut()
 * Uses: supabase.auth.getUser()
 * Uses: supabase.auth.exchangeCodeForSession() — for PKCE callback
 */

import { createClient } from "@/utils/supabase/server";
import { findOrCreateUserById, updateUserById } from "./db";

// ─── Server-side Auth ──────────────────────────────────────────

/** Request a magic link via Supabase Auth (email) */
export async function requestMagicLink(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://feorm.vercel.app"}/auth/callback`,
    },
  });

  if (error) {
    console.error("requestMagicLink error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/** Exchange PKCE code for session (called from /auth/callback route) */
export async function exchangeCodeForSession(code: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("exchangeCodeForSession error:", error);
    throw new Error(`Code exchange failed: ${error.message}`);
  }

  return data;
}

/** Get the current authenticated user's session */
export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/** Get the current authenticated user's profile */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  // Get the profile from the profiles table using auth.uid()
  return findOrCreateUserById(user.id, user.email);
}

/** Sign out the current user */
export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("signOut error:", error);
    throw new Error(`Sign out failed: ${error.message}`);
  }
}

/** Setup user identity (name, region, role) after magic link verification */
export async function setupIdentity(data: {
  userId: string;
  name: string;
  surname?: string;
  phone?: string;
  region: string;
  role: string;
}) {
  return updateUserById(data.userId, {
    name: data.name,
    surname: data.surname,
    phone: data.phone,
    region: data.region,
    role: data.role,
  });
}

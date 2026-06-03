/**
 * Feorm Auth — Supabase Auth Integration
 *
 * Uses: supabase.auth.signInWithOtp({ phone })
 * Uses: supabase.auth.verifyOtp({ phone, token })
 * Uses: supabase.auth.getSession()
 * Uses: supabase.auth.signOut()
 * Uses: supabase.auth.getUser()
 */

import { createClient } from "@/utils/supabase/server";
import { findOrCreateUser, updateUser } from "./db";

// ─── Server-side Auth ──────────────────────────────────────────

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

  // Get the profile from the profiles table
  const phone = user.phone ?? user.user_metadata?.phone;
  if (!phone) return null;

  return findOrCreateUser(phone);
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

/** Request OTP via Supabase Auth */
export async function requestOtp(
  phone: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
  const supabase = await createClient();

  // Ensure phone has the +264 country code for Namibia
  const formattedPhone = phone.startsWith("+") ? phone : `+264${phone}`;

  const { error } = await supabase.auth.signInWithOtp({
    phone: formattedPhone,
  });

  if (error) {
    console.error("requestOtp error:", error);
    return { success: false, error: error.message };
  }

  // Pre-create the profile if it doesn't exist
  try {
    const user = await findOrCreateUser(formattedPhone);
    return { success: true, userId: user.id };
  } catch {
    // Profile creation can fail silently — it'll be created on verify
    return { success: true };
  }
}

/** Verify OTP via Supabase Auth */
export async function verifyOtpCode(
  phone: string,
  otp: string
): Promise<{ success: boolean; userId?: string; isNewUser?: boolean; error?: string }> {
  const supabase = await createClient();

  const formattedPhone = phone.startsWith("+") ? phone : `+264${phone}`;

  const { data, error } = await supabase.auth.verifyOtp({
    phone: formattedPhone,
    token: otp,
    type: "sms",
  });

  if (error) {
    console.error("verifyOtpCode error:", error);
    return { success: false, error: error.message };
  }

  // Ensure profile exists
  try {
    const user = await findOrCreateUser(formattedPhone);
    const isNewUser = user.role === "explorer" && !user.name;

    return {
      success: true,
      userId: user.id,
      isNewUser,
    };
  } catch (profileError) {
    console.error("Profile creation after OTP verify failed:", profileError);
    return {
      success: true,
      userId: data.user?.id,
      isNewUser: true,
    };
  }
}

/** Setup user identity (name, surname, region, role) after OTP verification */
export async function setupIdentity(data: {
  phone: string;
  name: string;
  surname: string;
  region: string;
  role: string;
}) {
  const formattedPhone = data.phone.startsWith("+") ? data.phone : `+264${data.phone}`;

  return updateUser(formattedPhone, {
    name: data.name,
    surname: data.surname,
    region: data.region,
    role: data.role,
  });
}

import { exchangeCodeForSession, getCurrentUser } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Auth callback route — handles magic link PKCE code exchange.
 *
 * When a user clicks the magic link in their email, Supabase redirects
 * them here with a `code` query parameter. We exchange the code for a
 * session, then redirect the user based on whether they have a profile.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    // No code — redirect to auth page
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  try {
    // Exchange the PKCE code for a session
    await exchangeCodeForSession(code);

    // Check if user has completed their profile
    const user = await getCurrentUser();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://feorm.vercel.app";

    if (user && user.name) {
      // Existing user with profile — go to marketplace
      return NextResponse.redirect(new URL("/marketplace", baseUrl));
    }

    // New user or incomplete profile — go to identity setup
    return NextResponse.redirect(new URL("/auth/identity", baseUrl));
  } catch (error) {
    console.error("Auth callback error:", error);
    // On error, redirect to auth page
    return NextResponse.redirect(new URL("/auth", request.url));
  }
}

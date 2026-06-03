import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Auth callback route — handles magic link PKCE code exchange.
 *
 * When a user clicks the magic link in their email, Supabase redirects
 * them here with a `code` query parameter. We exchange the code for a
 * session, then redirect the user based on whether they have a profile.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Validate the next param — only allow relative paths starting with /
  // Reject absolute URLs (http://) and protocol-relative URLs (//)
  const rawNext = searchParams.get("next") ?? "/marketplace";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//")
    ? rawNext
    : "/marketplace";

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Check if user has completed their profile
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Check if profile has a name (indicates onboarding completed)
          const { data: profile } = await supabase
            .from("profiles")
            .select("name, role")
            .eq("id", user.id)
            .maybeSingle();

          if (profile?.name && profile?.role && profile.role !== "guest") {
            return NextResponse.redirect(`${origin}/marketplace`);
          }
          // New user or incomplete profile — go to role selection
          return NextResponse.redirect(`${origin}/auth/role`);
        }

        return NextResponse.redirect(`${origin}${next}`);
      }
    } catch (error) {
      console.error("Auth callback error:", error);
    }
  }

  // No code or exchange failed
  return NextResponse.redirect(`${origin}/auth?error=callback_failed`);
}

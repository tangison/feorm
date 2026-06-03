import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { requestMagicLink, getCurrentUser, signOut, setupIdentity } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, name, surname, phone, region, role, userId } = body;

    // Step 1: Request magic link
    if (action === "request-magic-link") {
      const result = await requestMagicLink(email);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: "Magic link sent to your email",
      });
    }

    // Step 2: Setup Identity (after magic link verification)
    if (action === "setup-identity") {
      // Auth guard — must be signed in to set up identity
      const supabase = await createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const user = await setupIdentity({ userId, name, surname, phone, region, role });
      return NextResponse.json({ success: true, user });
    }

    // Step 3: Get current user
    if (action === "me") {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
      return NextResponse.json({ user });
    }

    // Step 4: Sign out
    if (action === "sign-out") {
      await signOut();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Authentication failed" },
      { status: 500 }
    );
  }
}

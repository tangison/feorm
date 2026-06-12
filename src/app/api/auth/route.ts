import { NextResponse } from "next/server";
import { DEMO_USER, DEMO_PROFILES, getProfileById } from "@/lib/demo-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, name, surname, phone, region, role, userId } = body;

    // Request magic link — demo: auto-sign-in
    if (action === "request-magic-link") {
      return NextResponse.json({
        success: true,
        message: "Demo mode — auto sign-in enabled",
        demoUser: DEMO_USER,
      });
    }

    // Setup Identity — demo: update the demo user
    if (action === "setup-identity") {
      const updatedUser = {
        ...DEMO_USER,
        name: name || DEMO_USER.name,
        surname: surname || DEMO_USER.surname,
        phone: phone || DEMO_USER.phone,
        region: region || DEMO_USER.region,
        role: role || DEMO_USER.role,
      };
      return NextResponse.json({ success: true, user: updatedUser });
    }

    // Get current user — demo: always returns the demo user
    if (action === "me") {
      return NextResponse.json({ user: DEMO_USER });
    }

    // Sign out — demo: returns success
    if (action === "sign-out") {
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

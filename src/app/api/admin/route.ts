import { NextResponse } from "next/server";
import { DEMO_PROFILES, DEMO_LISTINGS, DEMO_BOOKINGS } from "@/lib/demo-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // Get pending verifications
    if (action === "pending-verifications") {
      const pending = DEMO_PROFILES.filter(
        (p) => p.role === "provider_stay" && !p.verified
      ).map((p) => ({
        id: p.id,
        name: p.name,
        surname: p.surname,
        role: p.role,
        region: p.region,
        created_at: p.createdAt,
        verified: p.verified,
      }));
      return NextResponse.json({ pending });
    }

    // Get dashboard stats
    if (action === "stats") {
      return NextResponse.json({
        totalUsers: DEMO_PROFILES.length,
        totalListings: DEMO_LISTINGS.length,
        totalBookings: DEMO_BOOKINGS.length,
      });
    }

    // Get all listings (including inactive) for admin
    if (action === "all-listings") {
      const listings = DEMO_LISTINGS.map((l) => ({
        ...l,
        profiles: { name: l.hostName, phone: l.hostPhone },
      }));
      return NextResponse.json({ listings });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // Approve provider verification — demo: always returns success
    if (action === "approve") {
      return NextResponse.json({ success: true });
    }

    // Reject provider verification — demo: always returns success
    if (action === "reject") {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

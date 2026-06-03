import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // Get pending verifications
    if (action === "pending-verifications") {
      const { data: pending, error } = await supabase
        .from("profiles")
        .select("id, name, surname, role, region, created_at, verified")
        .in("role", ["provider_stay", "provider_equipment"])
        .eq("verified", false)
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ pending: pending ?? [] });
    }

    // Get dashboard stats
    if (action === "stats") {
      const [usersRes, listingsRes, bookingsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("listings").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
      ]);

      return NextResponse.json({
        totalUsers: usersRes.count ?? 0,
        totalListings: listingsRes.count ?? 0,
        totalBookings: bookingsRes.count ?? 0,
      });
    }

    // Get all listings (including inactive) for admin
    if (action === "all-listings") {
      const { data: listings, error } = await supabase
        .from("listings")
        .select("*, profiles(name, phone)")
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ listings: listings ?? [] });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { action, userId, listingId, note } = body;

    // Approve provider verification
    if (action === "approve" && userId) {
      const { error } = await supabase
        .from("profiles")
        .update({ verified: true })
        .eq("id", userId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Also activate any listings by this provider
      await supabase
        .from("listings")
        .update({ active: true })
        .eq("host_id", userId);

      return NextResponse.json({ success: true });
    }

    // Reject provider verification (set status back to needs_revision)
    if (action === "reject" && userId) {
      const { error } = await supabase
        .from("profiles")
        .update({ verified: false, role: "guest" })
        .eq("id", userId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * Seed development data into Supabase.
 *
 * Tables seeded: profiles, listings
 * Call POST /api/seed with header x-seed-secret to populate the database.
 *
 * Column mapping (seed data → DB schema):
 *   profiles.role          → check ('guest','voyager','provider_stay','admin')
 *   listings.price_cents   → integer (prices in N$ cents)
 *   listings.category      → check ('stay')
 *   listings.images        → text[] default '{}'
 *   listings.amenities     → text[] default '{}'
 *   listings.active        → boolean default true
 */
export async function POST(request: NextRequest) {
  try {
    // Protect seed route with secret key
    const secret = request.headers.get("x-seed-secret");
    if (secret !== process.env.SEED_SECRET) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const supabase = await createClient();

    // ─── Seed Profiles ──────────────────────────────────────────
    const profiles = [
      {
        id: "a0000000-0000-0000-0000-000000000001",
        phone: "+264 81 234 5678",
        name: "Aisha",
        surname: "Mwangi",
        region: "Oshikoto",
        role: "provider_stay",
        verified: true,
      },
      {
        id: "a0000000-0000-0000-0000-000000000002",
        phone: "+264 81 345 6789",
        name: "Johan",
        surname: "Pretorius",
        region: "Khomas",
        role: "provider_stay",
        verified: true,
      },
    ];

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(profiles, { onConflict: "id" });

    if (profileError) {
      console.error("Seed profiles error:", profileError);
      return NextResponse.json(
        { error: `Failed to seed profiles: ${profileError.message}` },
        { status: 500 }
      );
    }

    // ─── Seed Listings ──────────────────────────────────────────
    // Column names match schema.sql exactly:
    //   price_cents, category, images, amenities, host_id, host_phone, active
    const listings = [
      {
        id: "b0000000-0000-0000-0000-000000000001",
        title: "Tsumeb Etosha Edge Lodge",
        region: "Oshikoto",
        price_cents: 150000, // N$1,500 per night in cents
        category: "stay",
        description:
          "Watch wildlife from your private deck — a waterhole attracts zebra, giraffe, and antelope from the Etosha pan just beyond the fence. After dark, the sky fills with stars undimmed by city lights. The Hoba Meteorite, the largest on Earth, is a short drive away.",
        images: "{}",
        amenities: ["Swimming pool", "Game farm", "Hot water", "WiFi (limited)", "Bush view", "Stargazing deck", "Guided farm walks"],
        host_id: "a0000000-0000-0000-0000-000000000001",
        host_phone: "+264 81 234 5678",
        active: true,
      },
    ];

    const { error: listingError } = await supabase
      .from("listings")
      .upsert(listings, { onConflict: "id" });

    if (listingError) {
      console.error("Seed listings error:", listingError);
      return NextResponse.json(
        { error: `Failed to seed listings: ${listingError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${profiles.length} profiles and ${listings.length} listings`,
      profiles: profiles.length,
      listings: listings.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}

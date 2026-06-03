import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * Seed development data into Supabase.
 *
 * Tables seeded: profiles, listings
 * Call POST /api/seed with header x-seed-secret to populate the database.
 *
 * Column mapping (seed data → DB schema):
 *   profiles.role          → check ('guest','voyager','provider_stay','provider_equipment','admin')
 *   listings.price_cents   → integer (prices in N$ cents)
 *   listings.category      → check ('stay','equipment')
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
      {
        id: "a0000000-0000-0000-0000-000000000003",
        phone: "+264 81 901 2345",
        name: "Tangeni",
        surname: "Nambinga",
        region: "Oshana",
        role: "provider_equipment",
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
        title: "Oshikoto Heritage Farm Stay",
        region: "Oshikoto",
        price_cents: 22000, // N$220 per night in cents
        category: "stay",
        description:
          "A working cattle farm rooted in Ovambo tradition. Guests participate in milking routines, mahangu planting, and communal fireside storytelling under the Milky Way. No resort pretence — only what the land and community provide.",
        images: "{}",
        amenities: ["Farm-to-table meals", "Guided bush walk", "Stargazing deck", "Communal fire pit", "Off-grid solar power"],
        host_id: "a0000000-0000-0000-0000-000000000001",
        host_phone: "+264 81 234 5678",
        active: true,
      },
      {
        id: "b0000000-0000-0000-0000-000000000002",
        title: "Khomas Highland Tractor",
        region: "Khomas",
        price_cents: 250000, // N$2,500 per day in cents
        category: "equipment",
        description:
          "85HP Massey Ferguson shared through the Feorm trust network. Low hours, PTO attachment, front loader ready. Seasonal availability. The land requires the right tools; this is one of them.",
        images: "{}",
        amenities: ["85HP engine", "PTO attachment", "Front loader ready", "Low hours", "Community-verified"],
        host_id: "a0000000-0000-0000-0000-000000000002",
        host_phone: "+264 81 345 6789",
        active: true,
      },
      {
        id: "b0000000-0000-0000-0000-000000000003",
        title: "Oshana Solar Pump Kit",
        region: "Oshana",
        price_cents: 120000, // N$1,200 per day in cents
        category: "equipment",
        description:
          "High-flow borehole pump with 5kW solar array. Remote monitoring capable. Weather-sealed and low maintenance. Shared access through the platform reduces capital burden while maintaining uptime.",
        images: "{}",
        amenities: ["High-flow capacity", "Solar-compatible", "Borehole rated", "Remote monitoring", "Low maintenance"],
        host_id: "a0000000-0000-0000-0000-000000000003",
        host_phone: "+264 81 901 2345",
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

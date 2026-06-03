import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * Seed development data into Supabase.
 *
 * Tables seeded: profiles, listings
 * Call POST /api/seed to populate the database with sample data.
 */
export async function POST() {
  try {
    const supabase = await createClient();

    // ─── Seed Profiles ──────────────────────────────────────────
    const profiles = [
      {
        id: "seed-host-1",
        phone: "+264812345001",
        name: "Aisha",
        surname: "Mwangi",
        region: "Oshikoto",
        role: "provider",
        verified: true,
      },
      {
        id: "seed-host-2",
        phone: "+264812345002",
        name: "Johan",
        surname: "Pretorius",
        region: "Khomas",
        role: "provider",
        verified: true,
      },
      {
        id: "seed-host-3",
        phone: "+264812345003",
        name: "Tangeni",
        surname: "Nambinga",
        region: "Oshana",
        role: "provider",
        verified: false,
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
    const listings = [
      {
        id: "seed-listing-1",
        title: "Oshikoto Heritage Farm Stay",
        region: "Oshikoto",
        price: 22000, // N$220 per night in cents
        type: "stay",
        category: "lodge",
        description:
          "A working cattle farm rooted in Ovambo tradition. Guests participate in milking routines, mahangu planting, and communal fireside storytelling under the Milky Way. No resort pretence — only what the land and community provide.",
        image_url: "/images/listing-stay-hero.png",
        features: "Farm-to-table meals,Guided bush walk,Stargazing deck,Communal fire pit,Off-grid solar power",
        host_id: "seed-host-1",
        host_name: "Aisha Mwangi",
        host_phone: "+264812345001",
        available: true,
      },
      {
        id: "seed-listing-2",
        title: "Khomas Highland Tractor",
        region: "Khomas",
        price: 250000, // N$2,500 per day in cents
        type: "equipment",
        category: "tractor",
        description:
          "85HP Massey Ferguson shared through the Feorm trust network. Low hours, PTO attachment, front loader ready. Seasonal availability. The land requires the right tools; this is one of them.",
        image_url: "/images/listing-equip-hero.png",
        features: "85HP engine,PTO attachment,Front loader ready,Low hours,Community-verified",
        host_id: "seed-host-2",
        host_name: "Johan Pretorius",
        host_phone: "+264812345002",
        available: true,
      },
      {
        id: "seed-listing-3",
        title: "Oshana Solar Pump Kit",
        region: "Oshana",
        price: 120000, // N$1,200 per day in cents
        type: "equipment",
        category: "pump",
        description:
          "High-flow borehole pump with 5kW solar array. Remote monitoring capable. Weather-sealed and low maintenance. Shared access through the platform reduces capital burden while maintaining uptime.",
        image_url: "/images/listing-equip-hero.png",
        features: "High-flow capacity,Solar-compatible,Borehole rated,Remote monitoring,Low maintenance",
        host_id: "seed-host-3",
        host_name: "Tangeni Nambinga",
        host_phone: "+264812345003",
        available: true,
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

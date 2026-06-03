import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getListings, getListingById, createListing } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  try {
    if (id) {
      const listing = await getListingById(id);
      if (!listing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });
      }
      return NextResponse.json(listing);
    }

    const listings = await getListings(type ?? undefined);
    return NextResponse.json(listings);
  } catch (error) {
    console.error("Listings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Auth guard — must be signed in to create listings
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const listing = await createListing({
      title: body.title,
      region: body.region,
      price: body.price,
      type: body.type,
      category: body.category,
      description: body.description,
      imageUrl: body.imageUrl,
      features: body.features,
      hostId: body.hostId,
      hostName: body.hostName,
      hostPhone: body.hostPhone,
      available: true,
      lat: body.lat,
      lng: body.lng,
    });
    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("Listings POST error:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}

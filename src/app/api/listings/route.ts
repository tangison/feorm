import { NextResponse } from "next/server";
import { getListingsByType, getListingById, DEMO_LISTINGS } from "@/lib/demo-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  try {
    if (id) {
      const listing = getListingById(id);
      if (!listing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });
      }
      return NextResponse.json(listing);
    }

    const listings = getListingsByType(type ?? undefined);
    return NextResponse.json(listings);
  } catch (error) {
    console.error("Listings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Create a fake listing from the posted data
    const newListing = {
      id: `b${Date.now().toString(36).padStart(8, "0")}-0000-0000-0000-000000000001`,
      title: body.title || "New Listing",
      region: body.region || "Khomas",
      price: body.price || 100000,
      type: body.type || "stay",
      category: body.category || "stay",
      description: body.description || "",
      imageUrl: body.imageUrl || "",
      features: body.features || "",
      hostId: body.hostId || "d0000000-0000-0000-0000-000000000001",
      hostName: body.hostName || "Demo",
      hostPhone: body.hostPhone || "+264 81 100 2000",
      available: true,
      lat: body.lat ?? null,
      lng: body.lng ?? null,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    console.error("Listings POST error:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}

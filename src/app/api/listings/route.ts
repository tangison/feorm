import { NextResponse } from "next/server";
import { getDemoListings, getDemoListingById } from "@/lib/demo-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  try {
    if (id) {
      const listing = getDemoListingById(id);
      if (!listing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });
      }
      // Map to the format expected by the frontend
      return NextResponse.json({
        id: listing.id,
        title: listing.title,
        region: listing.region,
        price: listing.price,
        type: listing.type,
        category: listing.category,
        description: listing.description,
        imageUrl: listing.images[0] || "/images/listing-stay-hero.png",
        images: listing.images,
        features: listing.features.join(","),
        hostId: listing.hostId,
        hostName: listing.hostName,
        hostPhone: listing.hostPhone,
        available: listing.available,
        lat: listing.lat,
        lng: listing.lng,
        rating: listing.rating,
        reviewCount: listing.reviewCount,
      });
    }

    const listings = getDemoListings();
    const mapped = listings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      region: listing.region,
      price: listing.price,
      type: listing.type,
      category: listing.category,
      description: listing.description,
      imageUrl: listing.images[0] || "/images/listing-stay-hero.png",
      images: listing.images,
      features: listing.features.join(","),
      hostId: listing.hostId,
      hostName: listing.hostName,
      hostPhone: listing.hostPhone,
      available: listing.available,
      lat: listing.lat,
      lng: listing.lng,
      rating: listing.rating,
      reviewCount: listing.reviewCount,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Listings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

export async function POST() {
  // Demo mode — no-op
  return NextResponse.json({ message: "Demo mode — listing creation disabled" }, { status: 200 });
}

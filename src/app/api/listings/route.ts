import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // stay | equipment

  try {
    const listings = await db.listing.findMany({
      where: {
        ...(type ? { type } : {}),
        available: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(listings);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const listing = await db.listing.create({
      data: {
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
        hostPhone: body.hostPhone || "+264810000000",
      },
    });
    return NextResponse.json(listing, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}

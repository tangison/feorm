import { NextResponse } from "next/server";
import { getBookingsByUserId, getBookingByReference, DEMO_BOOKINGS } from "@/lib/demo-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const reference = searchParams.get("reference");

  try {
    if (reference) {
      const booking = getBookingByReference(reference);
      if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }
      return NextResponse.json(booking);
    }

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const bookings = getBookingsByUserId(userId);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Bookings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate a demo reference number
    const referenceNumber = `FEA-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const escrowAmount = Math.max(50000, Math.round((body.totalPrice || 0) * 0.1));

    const newBooking = {
      id: `c${Date.now().toString(36).padStart(8, "0")}-0000-0000-0000-000000000001`,
      userId: body.userId || "d0000000-0000-0000-0000-000000000001",
      listingId: body.listingId || "",
      startDate: body.startDate || new Date().toISOString().split("T")[0],
      endDate: body.endDate || new Date().toISOString().split("T")[0],
      totalPrice: body.totalPrice || 0,
      escrowAmount,
      serviceFee: body.serviceFee || 0,
      status: "pending" as const,
      referenceNumber,
      listing: undefined as Record<string, string> | undefined,
      createdAt: new Date().toISOString(),
    };

    // Try to attach listing data
    const { getListingById } = await import("@/lib/demo-data");
    const listing = getListingById(body.listingId);
    if (listing) {
      newBooking.listing = {
        id: listing.id,
        title: listing.title,
        type: listing.type,
        category: listing.category,
        region: listing.region,
        imageUrl: listing.imageUrl,
      };
    }

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("Bookings POST error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

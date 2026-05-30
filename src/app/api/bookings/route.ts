import { NextResponse } from "next/server";
import { getBookings, createBooking } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const reference = searchParams.get("reference");

  try {
    if (reference) {
      // Reference lookup — search demo data
      try {
        const { DEMO_BOOKINGS } = await import("@/data/demo-bookings");
        const found = DEMO_BOOKINGS.find((b) => b.reference === reference);
        return NextResponse.json(found || { error: "Not found" }, { status: found ? 200 : 404 });
      } catch {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const bookings = await getBookings(userId);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Bookings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const booking = await createBooking({
      userId: body.userId,
      listingId: body.listingId,
      startDate: body.startDate,
      endDate: body.endDate,
      totalPrice: body.totalPrice,
      serviceFee: body.serviceFee,
      withOperator: body.withOperator,
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Bookings POST error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

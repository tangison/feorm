import { NextResponse } from "next/server";
import { getBookings, getBookingByReference, createBooking } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const reference = searchParams.get("reference");

  try {
    if (reference) {
      const booking = await getBookingByReference(reference);
      if (!booking) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(booking);
    }

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const bookings = await getBookings(userId);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Bookings GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

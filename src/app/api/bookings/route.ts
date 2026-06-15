import { NextResponse } from "next/server";
import { getDemoBookings } from "@/lib/demo-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  try {
    const bookings = getDemoBookings();

    if (reference) {
      const booking = bookings.find((b) => b.reference === reference);
      if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }
      return NextResponse.json(booking);
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Bookings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST() {
  // Demo mode — simulate a successful booking
  return NextResponse.json(
    {
      id: "booking-demo-" + Date.now(),
      reference: "FEA-" + Date.now().toString(36).toUpperCase(),
      status: "confirmed",
    },
    { status: 201 }
  );
}

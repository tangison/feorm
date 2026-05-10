import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const reference = searchParams.get("reference");

  // Reference lookup takes priority
  if (reference) {
    try {
      const booking = await db.booking.findUnique({
        where: { referenceNumber: reference },
        include: { listing: true },
      });
      return NextResponse.json(booking || { error: "Not found" }, { status: booking ? 200 : 404 });
    } catch {
      return NextResponse.json(
        { error: "Failed to fetch booking" },
        { status: 500 }
      );
    }
  }

  if (!userId) {
    return NextResponse.json(
      { error: "userId required" },
      { status: 400 }
    );
  }

  try {
    const bookings = await db.booking.findMany({
      where: { userId },
      include: { listing: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, listingId, startDate, endDate, totalPrice, serviceFee, withOperator } = body;

    const ref = `FE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const booking = await db.booking.create({
      data: {
        userId,
        listingId,
        startDate,
        endDate,
        totalPrice,
        escrowAmount: 150000,
        serviceFee,
        referenceNumber: ref,
        withOperator: withOperator || false,
        status: "pending",
      },
      include: { listing: true },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

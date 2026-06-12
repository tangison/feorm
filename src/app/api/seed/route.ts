import { NextResponse } from "next/server";

/**
 * Seed route — demo mode.
 * Returns success immediately without touching any database.
 */
export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Demo mode — data is hardcoded, no seeding needed",
    profiles: 5,
    listings: 17,
    bookings: 4,
  });
}

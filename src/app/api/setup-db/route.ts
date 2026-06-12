import { NextResponse } from "next/server";

/**
 * Setup DB route — demo mode.
 * Returns success immediately without touching any database.
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Demo mode — no database setup needed. All data is hardcoded.",
    profileCount: 5,
    listingCount: 17,
  });
}

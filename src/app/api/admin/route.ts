import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Demo mode — admin API disabled",
    pending: [],
    totalUsers: 0,
    totalListings: 0,
    totalBookings: 0,
  });
}

export async function POST() {
  return NextResponse.json({
    message: "Demo mode — admin API disabled",
    success: false,
  });
}

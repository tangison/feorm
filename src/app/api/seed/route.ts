import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Demo mode — seeding disabled, data is hardcoded" });
}

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ user: null, message: "Demo mode — no auth" });
}

export async function POST() {
  return NextResponse.json({ message: "Demo mode — auth disabled" });
}

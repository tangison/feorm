import { NextResponse } from "next/server";

export async function POST() {
  // Seeding is only available with a persistent database
  // On Vercel, use Vercel Postgres, Neon, or Supabase
  // Demo data is automatically served when the DB is unavailable
  return NextResponse.json({
    message: "Demo mode: data is served from static demo files. For a persistent database, configure Vercel Postgres or Neon.",
    mode: "demo",
  });
}

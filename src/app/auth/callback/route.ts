import { type NextRequest, NextResponse } from "next/server";

/**
 * Auth callback route — demo mode.
 * In demo mode, we just redirect to the marketplace since there is no
 * real Supabase auth to exchange codes for.
 */
export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url);

  // In demo mode, just redirect to marketplace
  // No code exchange needed since we don't use Supabase
  return NextResponse.redirect(`${origin}/marketplace`);
}

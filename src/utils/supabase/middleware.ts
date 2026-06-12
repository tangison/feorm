/**
 * Supabase Middleware — Demo Mode
 *
 * This file is kept as a stub so that any remaining imports
 * do not cause build errors. It does NOT refresh Supabase sessions.
 */

import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

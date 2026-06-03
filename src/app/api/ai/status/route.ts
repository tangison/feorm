import { NextResponse } from "next/server";
import { checkProviders } from "@/lib/ai-providers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const health = await checkProviders();
    return NextResponse.json({
      providers: health,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI status check error:", error);
    return NextResponse.json(
      { error: "Failed to check provider status" },
      { status: 500 }
    );
  }
}

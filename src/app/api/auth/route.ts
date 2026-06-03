import { NextResponse } from "next/server";
import { requestOtp, verifyOtpCode, setupIdentity, getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, phone, otp, name, surname, region, role } = body;

    // Step 1: Request OTP
    if (action === "request-otp") {
      const result = await requestOtp(phone);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        userId: result.userId,
        message: "OTP sent to your phone",
      });
    }

    // Step 2: Verify OTP
    if (action === "verify-otp") {
      const result = await verifyOtpCode(phone, otp);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 401 });
      }
      return NextResponse.json({
        success: true,
        userId: result.userId,
        isNewUser: result.isNewUser,
      });
    }

    // Step 3: Setup Identity
    if (action === "setup-identity") {
      const user = await setupIdentity({ phone, name, surname, region, role });
      return NextResponse.json({ success: true, user });
    }

    // Step 4: Get current user
    if (action === "me") {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
      return NextResponse.json({ user });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Authentication failed" },
      { status: 500 }
    );
  }
}

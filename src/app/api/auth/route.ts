import { NextResponse } from "next/server";
import { findOrCreateUser, updateUser, verifyOtp } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, phone, otp, name, surname, region, role } = body;

    // Step 1: Request OTP (Demo Mode — always succeeds)
    if (action === "request-otp") {
      const user = await findOrCreateUser(phone);
      return NextResponse.json({
        success: true,
        message: "OTP sent (Demo: use 123456)",
        userId: user.id,
      });
    }

    // Step 2: Verify OTP (Demo Mode — accepts 123456)
    if (action === "verify-otp") {
      if (!verifyOtp(otp)) {
        return NextResponse.json(
          { error: "Invalid OTP. Demo mode: use 123456" },
          { status: 400 }
        );
      }

      const user = await findOrCreateUser(phone);
      return NextResponse.json({
        success: true,
        userId: user.id,
        isNewUser: !user.name,
        phone: user.phone,
      });
    }

    // Step 3: Setup Identity
    if (action === "setup-identity") {
      const user = await updateUser(phone, { name, surname, region, role: role || "explorer" });
      return NextResponse.json({ success: true, user });
    }

    // Step 4: Get current user
    if (action === "me") {
      const user = await findOrCreateUser(phone);
      return NextResponse.json({ user });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

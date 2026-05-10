import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const DEMO_PHONE = "+264810000000";
const DEMO_OTP = "123456";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, phone, otp, name, surname, region, role } = body;

    // Step 1: Request OTP (Demo Mode - always succeeds)
    if (action === "request-otp") {
      // Find or create user
      let user = await db.user.findUnique({ where: { phone } });
      if (!user) {
        user = await db.user.create({
          data: { phone },
        });
      }
      return NextResponse.json({
        success: true,
        message: "OTP sent (Demo: use 123456)",
        demoOtp: phone === DEMO_PHONE ? DEMO_OTP : undefined,
      });
    }

    // Step 2: Verify OTP (Demo Mode - accepts 123456)
    if (action === "verify-otp") {
      if (otp !== DEMO_OTP) {
        return NextResponse.json(
          { error: "Invalid OTP. Demo mode: use 123456" },
          { status: 400 }
        );
      }

      let user = await db.user.findUnique({ where: { phone } });
      if (!user) {
        user = await db.user.create({
          data: { phone },
        });
      }

      return NextResponse.json({
        success: true,
        userId: user.id,
        isNewUser: !user.name,
        phone: user.phone,
      });
    }

    // Step 3: Setup Identity
    if (action === "setup-identity") {
      const user = await db.user.update({
        where: { phone },
        data: {
          name,
          surname,
          region,
          role: role || "explorer",
        },
      });
      return NextResponse.json({ success: true, user });
    }

    // Step 4: Get current user
    if (action === "me") {
      const user = await db.user.findUnique({ where: { phone } });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ user });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

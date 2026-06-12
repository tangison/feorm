import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    // Demo mode — no auth guard, all requests are allowed

    const { name, region } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Build the avatar prompt based on name and region
    const genderHint = name.toLowerCase().endsWith("a") || name.toLowerCase().endsWith("na") ? "female" : "male";
    const regionContext = region ? ` from the ${region} region of Namibia` : " from Namibia";

    const prompt = `Professional editorial headshot of a ${genderHint} person${regionContext}. Style: Warm and natural. Lighting: Natural golden hour. Colors: Desaturated earth tones. Texture: High skin detail, cinematic depth of field. The person looks confident and welcoming. Neutral, dignified expression. 8k, photorealistic, studio portrait, warm earthy background`;

    const zai = await ZAI.create();

    const response = await zai.images.generations.create({
      prompt: prompt,
      size: "1024x1024",
    });

    const imageBase64 = response.data[0].base64;
    const buffer = Buffer.from(imageBase64, "base64");

    // Save to public/avatars/
    const avatarDir = path.join(process.cwd(), "public", "avatars");
    if (!fs.existsSync(avatarDir)) {
      fs.mkdirSync(avatarDir, { recursive: true });
    }

    const filename = `avatar-${Date.now()}.png`;
    const filepath = path.join(avatarDir, filename);
    fs.writeFileSync(filepath, buffer);

    const avatarUrl = `/avatars/${filename}`;

    return NextResponse.json({ avatarUrl, success: true });
  } catch (error) {
    console.error("Avatar generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate avatar", success: false },
      { status: 500 }
    );
  }
}

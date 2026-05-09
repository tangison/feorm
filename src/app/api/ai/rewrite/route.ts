import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, type, region } = body;

    if (!title && !description) {
      return NextResponse.json(
        { error: "Title or description is required" },
        { status: 400 }
      );
    }

    const prompt = `You are an AI copywriter for Feorm, a premium Namibian agrotourism marketplace. Rewrite the following listing to be more compelling and search-optimized. Keep the tone: Premium Utilitarian Minimalism. Use earthy, dignified language. No emojis.

Type: ${type || "listing"}
Region: ${region || "Namibia"}
Title: ${title || "Untitled"}
Description: ${description || "No description"}

Respond in JSON format: { "title": "rewritten title", "description": "rewritten description" }`;

    const zai = await ZAI.create();

    const response = await zai.chat.completions.create({
      model: "glm-4-flash",
      messages: [
        {
          role: "system",
          content: "You are a copywriter for the Feorm agrotourism platform. Always respond with valid JSON. No markdown, no code blocks, just the raw JSON object.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0]?.message?.content || "{}";

    let rewritten;
    try {
      rewritten = JSON.parse(content);
    } catch {
      const cleaned = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      try {
        rewritten = JSON.parse(cleaned);
      } catch {
        // Fallback with simple enhancement
        rewritten = {
          title: title ? `${title} — Premium Experience` : "Premium Listing",
          description: description
            ? `${description} Experience authentic Namibian hospitality with modern comforts.`
            : "An exceptional offering in the heart of Namibia.",
        };
      }
    }

    return NextResponse.json({
      original: { title, description },
      rewritten,
    });
  } catch (error) {
    console.error("AI rewrite error:", error);
    return NextResponse.json(
      { error: "Failed to rewrite listing" },
      { status: 500 }
    );
  }
}

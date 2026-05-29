import { NextRequest, NextResponse } from "next/server";
import { chatCompletion, type ChatMessage } from "@/lib/ai-providers";

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

    const messages: ChatMessage[] = [
      {
        role: "system",
        content:
          "You are a copywriter for Feorm, a premium Namibian agrotourism marketplace. Rewrite listings to be compelling and search-optimized. Tone: Premium Utilitarian Minimalism. Earthy, dignified language. No emojis. Always respond with valid JSON only — no markdown, no code blocks, just the raw JSON object: { \"title\": \"rewritten title\", \"description\": \"rewritten description\" }",
      },
      {
        role: "user",
        content: `Type: ${type || "listing"}\nRegion: ${region || "Namibia"}\nTitle: ${title || "Untitled"}\nDescription: ${description || "No description"}\n\nRewrite this listing.`,
      },
    ];

    try {
      const result = await chatCompletion(messages);

      let rewritten;
      try {
        rewritten = JSON.parse(result.content);
      } catch {
        const cleaned = result.content
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        try {
          rewritten = JSON.parse(cleaned);
        } catch {
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
        provider: result.provider,
      });
    } catch (aiError) {
      console.error("AI rewrite error:", aiError);
      return NextResponse.json({
        original: { title, description },
        rewritten: {
          title: title ? `${title} — Premium Experience` : "Premium Listing",
          description: description
            ? `${description} Experience authentic Namibian hospitality with modern comforts.`
            : "An exceptional offering in the heart of Namibia.",
        },
        provider: "fallback",
      });
    }
  } catch (error) {
    console.error("Rewrite route error:", error);
    return NextResponse.json(
      { error: "Failed to rewrite listing" },
      { status: 500 }
    );
  }
}

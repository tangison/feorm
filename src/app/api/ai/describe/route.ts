import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { chatCompletion, type ChatMessage } from "@/lib/ai-providers";

const DESCRIBE_SYSTEM_PROMPT = `You are a listing enhancer for Feorm, a Namibian farm stay platform. Given a listing title and type, generate: 1) An editorial description (authoritative, minimal, earth-toned, max 100 words, no exclamation marks). 2) 4-6 feature/spec tags as short phrases. 3) A suggested price range in Namibian dollars (N$). Format your response as JSON: {"description": "...", "features": ["...", "..."], "suggestedPrice": {"min": <cents>, "max": <cents>}}. Prices are in N$ cents (e.g. 50000 = N$500). Be specific to Namibian agriculture and landscape. Respond with ONLY valid JSON, no markdown or code blocks.`;

interface DescribeBody {
  title: string;
  type: string;
}

interface DescribeResult {
  description: string;
  features: string[];
  suggestedPrice: {
    min: number;
    max: number;
  };
}

const STAY_FEATURES: Record<string, string[]> = {
  default: ["Farm-to-table meals", "Guided bush walk", "Stargazing deck", "Communal fire pit", "Off-grid solar power"],
  lodge: ["En-suite bathrooms", "Panoramic veranda", "Game drive access", "Farm-to-table dining", "Heritage decor", "Solar-heated water"],
  camp: ["Riverside setting", "Braai facilities", "Guided nature walk", "Bird watching", "Canvas glamping tents"],
};

function getFallbackResult(title: string, type: string): DescribeResult {
  const lowerTitle = title.toLowerCase();

  let featureSet: string[];
  if (lowerTitle.includes("lodge")) featureSet = STAY_FEATURES.lodge;
  else if (lowerTitle.includes("camp")) featureSet = STAY_FEATURES.camp;
  else featureSet = STAY_FEATURES.default;

  let priceMin: number;
  let priceMax: number;
  if (lowerTitle.includes("lodge")) { priceMin = 15000; priceMax = 45000; }
  else if (lowerTitle.includes("camp")) { priceMin = 8000; priceMax = 20000; }
  else { priceMin = 12000; priceMax = 35000; }

  const description = `${title} — a working farm stay rooted in the Namibian landscape. Guests participate in the daily rhythm of agriculture: sunrise routines, communal meals, and the quiet authority of land that sustains. No resort pretence. Only what the soil and community provide.`;

  return {
    description,
    features: featureSet.slice(0, 6),
    suggestedPrice: { min: priceMin, max: priceMax },
  };
}

function parseDescribeResult(raw: string, title: string, type: string): DescribeResult {
  const fallback = getFallbackResult(title, type);

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return fallback;

    const parsed = JSON.parse(jsonMatch[0]);

    const description = typeof parsed.description === "string" && parsed.description.length > 10
      ? parsed.description.trim()
      : fallback.description;

    const features = Array.isArray(parsed.features) && parsed.features.length >= 2
      ? parsed.features.slice(0, 6).map(String)
      : fallback.features;

    const suggestedPrice = {
      min: typeof parsed.suggestedPrice?.min === "number" && parsed.suggestedPrice.min > 0
        ? parsed.suggestedPrice.min
        : fallback.suggestedPrice.min,
      max: typeof parsed.suggestedPrice?.max === "number" && parsed.suggestedPrice.max > 0
        ? parsed.suggestedPrice.max
        : fallback.suggestedPrice.max,
    };

    if (suggestedPrice.max < suggestedPrice.min) {
      suggestedPrice.max = suggestedPrice.min * 2;
    }

    return { description, features, suggestedPrice };
  } catch {
    return fallback;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Auth guard — must be signed in to use AI describe
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: DescribeBody = await request.json();
    const { title, type } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const listingType = type || "stay";
    let result: DescribeResult;

    try {
      const messages: ChatMessage[] = [
        {
          role: "system",
          content: DESCRIBE_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Generate enhanced listing details for:\n\nTitle: ${title}\nType: ${listingType}`,
        },
      ];

      const aiResult = await chatCompletion(messages);
      result = parseDescribeResult(aiResult.content, title, listingType);
    } catch (sdkError) {
      console.error("AI describe error, falling back to template:", sdkError);
      result = getFallbackResult(title, listingType);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Describe route error:", error);
    return NextResponse.json(
      { error: "Failed to generate listing details" },
      { status: 500 }
    );
  }
}

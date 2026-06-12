import { NextRequest, NextResponse } from "next/server";
import { chatCompletion, type ChatMessage } from "@/lib/ai-providers";

const SUGGEST_SYSTEM_PROMPT = `You are a Namibian agrotourism advisor for Feorm. Generate 3 personalized recommendations. Format each as JSON: {title, description, category}. Categories: 'experience', 'optimization'. Keep descriptions under 40 words. Be specific to Namibian regions and agricultural context. Respond with ONLY a valid JSON array, no markdown or code blocks.`;

interface SuggestBody {
  role: string;
  interests: string[];
  region: string;
}

interface Suggestion {
  title: string;
  description: string;
  category: string;
}

function getFallbackVoyagerSuggestions(region: string, interests: string[]): Suggestion[] {
  const regionName = region || "Namibia";

  return [
    {
      title: `Sunrise Harvest Walk — ${regionName}`,
      description: `Join a working farm at dawn. Walk the fields, learn dryland techniques, share a meal with the community.`,
      category: "experience",
    },
    {
      title: "Heritage Cattle Post Visit",
      description: `Spend a day at a traditional cattle post. Understand Namibia's pastoral legacy and the communal grazing model.`,
      category: "experience",
    },
    {
      title: `Kalahari Farm Trail — ${regionName}`,
      description: `Hike through working farmland with guided commentary on indigenous plants and soil conservation techniques.`,
      category: "experience",
    },
  ];
}

function getFallbackProviderSuggestions(region: string, interests: string[]): Suggestion[] {
  const regionName = region || "Namibia";

  return [
    {
      title: "Seasonal Demand Pricing",
      description: `Adjust rental rates for harvest and planting seasons. ${regionName} demand peaks from March to May.`,
      category: "optimization",
    },
    {
      title: "Agrotourism Experience Bundle",
      description: `Pair your farm stay with a guided farm tour. Voyagers pay well for hands-on agricultural immersion in ${regionName}.`,
      category: "experience",
    },
    {
      title: "Listing Photo Upgrade",
      description: `Professional photos increase booking rates by up to 40%. Showcase your sunrise views and communal spaces in ${regionName}.`,
      category: "optimization",
    },
  ];
}

function parseSuggestions(raw: string): Suggestion[] {
  try {
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, 3).map((item: Record<string, string>) => ({
          title: String(item.title || "Untitled"),
          description: String(item.description || "").slice(0, 200),
          category: ["experience", "optimization"].includes(item.category)
            ? item.category
            : "experience",
        }));
      }
    }
    return [];
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    // Demo mode — no auth guard, all requests are allowed

    const body: SuggestBody = await request.json();
    const { role, interests = [], region } = body;

    if (!role) {
      return NextResponse.json(
        { error: "Role is required (voyager or provider)" },
        { status: 400 }
      );
    }

    let suggestions: Suggestion[];

    try {
      const isVoyager = role === "voyager";
      const roleContext = isVoyager
        ? `The user is a voyager (traveller/explorer) interested in: ${interests.join(", ") || "agriculture, nature, culture"}.`
        : `The user is a provider (farm owner) with assets in: ${interests.join(", ") || "farm stays"}.`;

      const userMessage = `${roleContext} Region: ${region || "Namibia"}. Generate 3 ${isVoyager ? "curated experience recommendations" : "asset optimization tips"} specific to this context.`;

      const messages: ChatMessage[] = [
        { role: "system", content: SUGGEST_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ];

      const result = await chatCompletion(messages);
      const parsed = parseSuggestions(result.content);

      if (parsed.length === 3) {
        suggestions = parsed;
      } else {
        const fallback = isVoyager
          ? getFallbackVoyagerSuggestions(region, interests)
          : getFallbackProviderSuggestions(region, interests);
        suggestions = [...parsed, ...fallback.slice(parsed.length)].slice(0, 3);
      }
    } catch (aiError) {
      console.error("AI suggest error, falling back to static:", aiError);
      suggestions =
        role === "voyager"
          ? getFallbackVoyagerSuggestions(region, interests)
          : getFallbackProviderSuggestions(region, interests);
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Suggest route error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}

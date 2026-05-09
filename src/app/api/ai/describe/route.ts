import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

const DESCRIBE_SYSTEM_PROMPT = `You are a listing enhancer for Feorm, a Namibian agrotourism and equipment rental marketplace. Given a listing title and type, generate: 1) An editorial description (authoritative, minimal, earth-toned, max 100 words, no exclamation marks). 2) 4-6 feature/spec tags as short phrases. 3) A suggested price range in Namibian dollars (N$). Format your response as JSON: {"description": "...", "features": ["...", "..."], "suggestedPrice": {"min": <cents>, "max": <cents>}}. Prices are in N$ cents (e.g. 50000 = N$500). Be specific to Namibian agriculture and landscape.`;

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

const EQUIPMENT_FEATURES: Record<string, string[]> = {
  default: ["Community-verified", "Diesel-powered", "Delivery available", "Operator included", "Maintenance log"],
  tractor: ["85HP engine", "PTO attachment", "Front loader ready", "Low hours", "Community-verified"],
  pump: ["High-flow capacity", "Solar-compatible", "Borehole rated", "Remote monitoring", "Low maintenance"],
  solar: ["5kW array", "Battery storage", "Grid-tie capable", "Weather-sealed", "10-year warranty"],
  drill: ["150m depth capacity", "Mud rotary system", "Truck-mounted", "Licensed operator", "Water quality testing"],
  harvester: ["Combine header", "Grain tank capacity", "GPS guidance", "Low grain loss", "Seasonal availability"],
};

function getFallbackResult(title: string, type: string): DescribeResult {
  const isEquipment = type === "equipment";
  const lowerTitle = title.toLowerCase();

  // Pick features based on title keywords
  let featureSet: string[];
  if (isEquipment) {
    if (lowerTitle.includes("tractor")) featureSet = EQUIPMENT_FEATURES.tractor;
    else if (lowerTitle.includes("pump")) featureSet = EQUIPMENT_FEATURES.pump;
    else if (lowerTitle.includes("solar")) featureSet = EQUIPMENT_FEATURES.solar;
    else if (lowerTitle.includes("drill") || lowerTitle.includes("borehole")) featureSet = EQUIPMENT_FEATURES.drill;
    else if (lowerTitle.includes("harvest") || lowerTitle.includes("combine")) featureSet = EQUIPMENT_FEATURES.harvester;
    else featureSet = EQUIPMENT_FEATURES.default;
  } else {
    if (lowerTitle.includes("lodge")) featureSet = STAY_FEATURES.lodge;
    else if (lowerTitle.includes("camp")) featureSet = STAY_FEATURES.camp;
    else featureSet = STAY_FEATURES.default;
  }

  // Generate price range based on type
  let priceMin: number;
  let priceMax: number;
  if (isEquipment) {
    if (lowerTitle.includes("tractor")) { priceMin = 150000; priceMax = 350000; }
    else if (lowerTitle.includes("drill") || lowerTitle.includes("borehole")) { priceMin = 200000; priceMax = 500000; }
    else if (lowerTitle.includes("solar")) { priceMin = 80000; priceMax = 180000; }
    else if (lowerTitle.includes("harvest") || lowerTitle.includes("combine")) { priceMin = 250000; priceMax = 600000; }
    else { priceMin = 50000; priceMax = 200000; }
  } else {
    if (lowerTitle.includes("lodge")) { priceMin = 15000; priceMax = 45000; }
    else if (lowerTitle.includes("camp")) { priceMin = 8000; priceMax = 20000; }
    else { priceMin = 12000; priceMax = 35000; }
  }

  // Template description
  const descriptions = isEquipment
    ? `${title} — communal machinery within the Feorm trust network. Shared access reduces capital burden while maintaining uptime across seasons. Maintained to working standard. Available for scheduled booking through the platform. The land requires the right tools; this is one of them.`
    : `${title} — a working farm stay rooted in the Namibian landscape. Guests participate in the daily rhythm of agriculture: sunrise routines, communal meals, and the quiet authority of land that sustains. No resort pretence. Only what the soil and community provide.`;

  return {
    description: descriptions,
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

    // Ensure max >= min
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
      const zai = await ZAI.create();
      const userMessage = `Generate enhanced listing details for:\n\nTitle: ${title}\nType: ${listingType}`;

      const response = await zai.chat.completions.create({
        model: "glm-4-flash",
        messages: [
          { role: "system", content: DESCRIBE_SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
      });

      const raw = response.choices[0].message.content.trim();
      result = parseDescribeResult(raw, title, listingType);
    } catch (sdkError) {
      console.error("AI describe SDK error, falling back to template:", sdkError);
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

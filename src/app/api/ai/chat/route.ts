import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

const TANGISON_SYSTEM_PROMPT = `You are Tangison, the AI assistant for Feorm — a Namibian agrotourism and equipment rental marketplace. You are deeply knowledgeable about:

1. Namibia's 14 regions and their agricultural practices
2. All ethnic groups: Ovambo, Kavango, Herero, Himba, Damara, Nama, San, Lozi, Tswana, Baster, and Afrikaner communities
3. Seasonal farming cycles: mahangu planting (Nov-Jan), harvest (Mar-May), dry season equipment needs
4. Agrotourism best practices: farm stays, cultural exchanges, equipment sharing
5. Feorm's escrow protocol, verification system, and booking process
6. Namibian currency (NAD), phone format (+264), and local context

Your personality: Warm but precise. You speak with the grounded authority of someone who knows the land. You use "we" for Feorm. You never use emojis. You never stereotype or exoticize cultures — you present them with dignity and agency. You reference specific regions and practices when relevant.

Keep responses concise (under 150 words unless the user asks for detail). If you don't know something, say so honestly.

When asked about bookings, reference the escrow protocol (N$1,500 deposit) and verification requirements.
When asked about equipment, mention operator availability and condition reporting.
When asked about regions, be specific about agricultural practices and cultural context.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatBody {
  messages: ChatMessage[];
  context?: {
    currentPage?: string;
    selectedRole?: string;
    region?: string;
  };
}

function getTangisonFallback(messages: ChatMessage[]): string {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";

  if (lastMessage.includes("book") || lastMessage.includes("reserve")) {
    return "To book a listing on Feorm, select your dates, configure any options like an equipment operator, and initialize the contract. A N$1,500 security escrow is held and released upon confirmed return condition. All bookings are protected by our verification protocol.";
  }

  if (lastMessage.includes("region") || lastMessage.includes("where") || lastMessage.includes("area")) {
    return "Feorm operates across all 14 Namibian regions — from the Himba pastoral lands of Kunene to the Lozi floodplains of Zambezi. Each region has distinct agricultural cycles and cultural practices. Use the region filter on the marketplace to find listings near you.";
  }

  if (lastMessage.includes("equipment") || lastMessage.includes("machinery") || lastMessage.includes("tractor")) {
    return "Feorm's equipment exchange covers tractors, pumps, drilling rigs, solar arrays, and harvesting units. All rentals are secured by escrow, with optional trained operators available. Equipment condition is documented before and after each rental period.";
  }

  if (lastMessage.includes("verify") || lastMessage.includes("trust") || lastMessage.includes("id")) {
    return "Verification on Feorm involves uploading your National ID or Passport. Once verified, you receive a trust badge, priority booking access, and higher escrow limits. The process uses AI-assisted document review for faster processing.";
  }

  if (lastMessage.includes("pay") || lastMessage.includes("money") || lastMessage.includes("price") || lastMessage.includes("cost")) {
    return "All prices on Feorm are in Namibian Dollars (N$). Equipment rentals include a 10% service fee and a N$1,500 refundable escrow deposit. Host payouts are processed weekly via bank transfer or MTC Money with a minimum threshold of N$500.";
  }

  if (lastMessage.includes("culture") || lastMessage.includes("people") || lastMessage.includes("tradition")) {
    return "Namibia is home to diverse communities — the Ovambo majority in the north, Himba pastoralists in Kunene, Damara and Nama in the west, San communities in the east, and Lozi people in the Zambezi. Feorm listings are designed to honor these cultures with dignity, not as tourist spectacles.";
  }

  return "I'm Tangison, your Feorm assistant. I can help you navigate listings, understand our escrow booking protocol, learn about Namibian regions and agricultural practices, or optimize your provider listings. What would you like to know?";
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatBody = await request.json();
    const { messages = [], context } = body;

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    // Build context-aware system prompt
    let systemPrompt = TANGISON_SYSTEM_PROMPT;
    if (context?.currentPage) {
      systemPrompt += `\n\nThe user is currently on the "${context.currentPage}" page.`;
    }
    if (context?.selectedRole) {
      systemPrompt += `\n\nThe user's role is: ${context.selectedRole}.`;
    }
    if (context?.region) {
      systemPrompt += `\n\nThe user's region is: ${context.region}.`;
    }

    try {
      const zai = await ZAI.create();

      const chatMessages = [
        { role: "system" as const, content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ];

      const response = await zai.chat.completions.create({
        model: "glm-4-flash",
        messages: chatMessages,
      });

      const reply = response.choices[0]?.message?.content?.trim();

      if (reply) {
        return NextResponse.json({
          message: reply,
          assistant: "tangison",
        });
      }

      // Fallback if AI returns empty
      return NextResponse.json({
        message: getTangisonFallback(messages),
        assistant: "tangison",
      });
    } catch (sdkError) {
      console.error("Tangison SDK error, using fallback:", sdkError);
      return NextResponse.json({
        message: getTangisonFallback(messages),
        assistant: "tangison",
      });
    }
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}

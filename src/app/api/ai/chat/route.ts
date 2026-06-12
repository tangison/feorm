import { NextRequest, NextResponse } from "next/server";
import {
  streamChatCompletion,
  chatCompletion,
  type ChatMessage,
} from "@/lib/ai-providers";
import {
  buildTangisonPrompt,
  getTangisonFallback,
  type TangisonContext,
} from "@/lib/tangison-prompt";

interface ChatBody {
  messages: ChatMessage[];
  context?: TangisonContext;
  stream?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Demo mode — no auth guard, all requests are allowed

    const body: ChatBody = await request.json();
    const { messages = [], context, stream = true } = body;

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build context-aware system prompt
    const systemPrompt = buildTangisonPrompt(context);
    const allMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    // ─── Streaming response (default) ───
    if (stream) {
      const encoder = new TextEncoder();

      const readable = new ReadableStream({
        async start(controller) {
          try {
            await streamChatCompletion(
              allMessages,
              (text, provider) => {
                const chunk = JSON.stringify({ type: "delta", text, provider });
                controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
              },
              (provider, model) => {
                const done = JSON.stringify({
                  type: "done",
                  provider,
                  model,
                });
                controller.enqueue(encoder.encode(`data: ${done}\n\n`));
                controller.close();
              }
            );
          } catch (streamErr) {
            console.error(
              "[chat] Streaming failed, trying non-streaming:",
              streamErr
            );

            try {
              const result = await chatCompletion(allMessages);
              const chunk = JSON.stringify({
                type: "delta",
                text: result.content,
                provider: result.provider,
              });
              controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
              const done = JSON.stringify({
                type: "done",
                provider: result.provider,
                model: result.model,
              });
              controller.enqueue(encoder.encode(`data: ${done}\n\n`));
              controller.close();
            } catch (nonStreamErr) {
              console.error("[chat] All providers failed:", nonStreamErr);
              const lastMsg =
                messages[messages.length - 1]?.content ?? "";
              const fallback = getTangisonFallback(lastMsg);
              const chunk = JSON.stringify({
                type: "delta",
                text: fallback,
                provider: "fallback",
              });
              controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
              const done = JSON.stringify({
                type: "done",
                provider: "fallback",
                model: "static",
              });
              controller.enqueue(encoder.encode(`data: ${done}\n\n`));
              controller.close();
            }
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // ─── Non-streaming response ───
    try {
      const result = await chatCompletion(allMessages);
      return new Response(
        JSON.stringify({
          message: result.content,
          provider: result.provider,
          model: result.model,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (aiErr) {
      console.error("[chat] AI failed:", aiErr);
      const lastMsg = messages[messages.length - 1]?.content ?? "";
      const fallback = getTangisonFallback(lastMsg);
      return new Response(
        JSON.stringify({
          message: fallback,
          provider: "fallback",
          model: "static",
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("[chat] Route error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat message" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

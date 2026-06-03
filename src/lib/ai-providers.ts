/**
 * Feorm AI Provider System — OpenRouter only
 *
 * Single provider: OpenRouter (OpenAI-compatible chat completions)
 * Env var required: OPENROUTER_API_KEY
 * Streaming is supported.
 */

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionResult {
  content: string;
  provider: string;
  model: string;
  latencyMs: number;
}

export interface ProviderHealth {
  name: string;
  available: boolean;
  latencyMs?: number;
  error?: string;
}

// ──────────────────────────────────────────────
// OpenRouter API key validation
// ──────────────────────────────────────────────

function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }
  return key;
}

// ──────────────────────────────────────────────
// OpenRouter configuration
// ──────────────────────────────────────────────

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "openrouter/free";
const OPENROUTER_SITE_URL = "https://feorm.na";
const OPENROUTER_SITE_NAME = "Feorm";

function openrouterHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${getApiKey()}`,
    "Content-Type": "application/json",
    "HTTP-Referer": OPENROUTER_SITE_URL,
    "X-Title": OPENROUTER_SITE_NAME,
  };
}

// ──────────────────────────────────────────────
// Non-streaming completion
// ──────────────────────────────────────────────

async function openrouterCompletion(
  messages: ChatMessage[]
): Promise<string> {
  const res = await fetch(OPENROUTER_BASE_URL, {
    method: "POST",
    headers: openrouterHeaders(),
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenRouter ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() ?? "";
}

// ──────────────────────────────────────────────
// Streaming completion
// ──────────────────────────────────────────────

async function openrouterStream(
  messages: ChatMessage[],
  onChunk: (text: string) => void
): Promise<void> {
  const res = await fetch(OPENROUTER_BASE_URL, {
    method: "POST",
    headers: openrouterHeaders(),
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenRouter ${res.status}: ${text.slice(0, 200)}`);
  }

  if (!res.body) throw new Error("No response body for streaming");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === "data: [DONE]") continue;
      if (!trimmed.startsWith("data: ")) continue;

      try {
        const json = JSON.parse(trimmed.slice(6));
        const delta = json?.choices?.[0]?.delta?.content;
        if (delta) onChunk(delta);
      } catch {
        // Skip malformed SSE
      }
    }
  }
}

// ──────────────────────────────────────────────
// Provider health check
// ──────────────────────────────────────────────

export async function checkProviders(): Promise<ProviderHealth[]> {
  try {
    const start = Date.now();
    await openrouterCompletion([{ role: "user", content: "ping" }]);
    return [{ name: "openrouter", available: true, latencyMs: Date.now() - start }];
  } catch (err: any) {
    return [{ name: "openrouter", available: false, error: err?.message ?? "Unknown error" }];
  }
}

// ──────────────────────────────────────────────
// Non-streaming completion (for suggest, describe, rewrite)
// ──────────────────────────────────────────────

export async function chatCompletion(
  messages: ChatMessage[]
): Promise<ChatCompletionResult> {
  const start = Date.now();
  const content = await openrouterCompletion(messages);
  return {
    content,
    provider: "openrouter",
    model: OPENROUTER_MODEL,
    latencyMs: Date.now() - start,
  };
}

// ──────────────────────────────────────────────
// Streaming completion (for chat)
// ──────────────────────────────────────────────

export async function streamChatCompletion(
  messages: ChatMessage[],
  onChunk: (text: string, provider: string) => void,
  onDone: (provider: string, model: string) => void
): Promise<void> {
  await openrouterStream(messages, (text) => onChunk(text, "openrouter"));
  onDone("openrouter", OPENROUTER_MODEL);
}

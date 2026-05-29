/**
 * Feorm AI Provider System — Multi-provider abstraction with fallback chain
 *
 * Provider priority:
 *   1. Groq (ultra-fast, Llama 3.3 70B) — primary for chat
 *   2. Google Gemini Flash (native API) — balanced speed/quality
 *   3. OpenRouter (free rotation) — fallback
 *   4. z-ai-web-dev-sdk — last resort
 *
 * Gemini uses its native API format (not OpenAI-compatible).
 * Groq and OpenRouter use OpenAI-compatible chat completions.
 * Streaming is supported for all HTTP providers.
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
// OpenAI-compatible provider helpers (Groq, OpenRouter)
// ──────────────────────────────────────────────

async function openaiCompletion(
  baseUrl: string,
  headers: Record<string, string>,
  body: Record<string, unknown>
): Promise<string> {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() ?? "";
}

async function openaiStream(
  baseUrl: string,
  headers: Record<string, string>,
  body: Record<string, unknown>,
  onChunk: (text: string) => void
): Promise<void> {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status}: ${text.slice(0, 200)}`);
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
// Gemini native API helpers
// ──────────────────────────────────────────────

/** Convert ChatMessage[] to Gemini's contents format */
function toGeminiContents(messages: ChatMessage[]) {
  // Gemini doesn't have a "system" role in contents — use systemInstruction instead
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
  return contents;
}

function getGeminiSystemInstruction(messages: ChatMessage[]): string {
  const systemMsg = messages.find((m) => m.role === "system");
  return systemMsg?.content ?? "";
}

async function geminiCompletion(
  apiKey: string,
  messages: ChatMessage[],
  model: string
): Promise<string> {
  const systemInstruction = getGeminiSystemInstruction(messages);
  const contents = toGeminiContents(messages);

  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
}

async function geminiStream(
  apiKey: string,
  messages: ChatMessage[],
  model: string,
  onChunk: (text: string) => void
): Promise<void> {
  const systemInstruction = getGeminiSystemInstruction(messages);
  const contents = toGeminiContents(messages);

  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status}: ${text.slice(0, 300)}`);
  }

  if (!res.body) throw new Error("No response body for Gemini streaming");

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
      if (!trimmed || !trimmed.startsWith("data: ")) continue;

      try {
        const json = JSON.parse(trimmed.slice(6));
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) onChunk(text);
      } catch {
        // Skip malformed SSE
      }
    }
  }
}

// ──────────────────────────────────────────────
// z-ai SDK helper
// ──────────────────────────────────────────────

async function zaiCompletion(messages: ChatMessage[]): Promise<string> {
  const ZAI = (await import("z-ai-web-dev-sdk")).default;
  const zai = await ZAI.create();

  const response = await zai.chat.completions.create({
    model: "glm-4-flash",
    messages: messages.map((m) => ({
      role: m.role as "system" | "user" | "assistant",
      content: m.content,
    })),
    thinking: { type: "disabled" },
  });

  return response.choices[0]?.message?.content?.trim() ?? "";
}

// ──────────────────────────────────────────────
// Provider health check
// ──────────────────────────────────────────────

type ProviderName = "groq" | "gemini" | "openrouter" | "zai";

export async function checkProviders(): Promise<ProviderHealth[]> {
  const results: ProviderHealth[] = [];
  const providers: ProviderName[] = ["groq", "gemini", "openrouter", "zai"];

  for (const name of providers) {
    if (name === "zai") {
      results.push({ name, available: true });
      continue;
    }

    try {
      const start = Date.now();
      let ok = false;

      if (name === "groq") {
        const key = process.env.GROQ_API_KEY;
        if (!key) { results.push({ name, available: false, error: "No API key" }); continue; }
        try {
          await openaiCompletion(
            "https://api.groq.com/openai/v1/chat/completions",
            { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            { model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: "ping" }], max_tokens: 5 }
          );
          ok = true;
        } catch {}
      } else if (name === "gemini") {
        const key = process.env.GEMINI_API_KEY;
        if (!key) { results.push({ name, available: false, error: "No API key" }); continue; }
        try {
          await geminiCompletion(key, [{ role: "user", content: "ping" }], "gemini-2.0-flash");
          ok = true;
        } catch {}
      } else if (name === "openrouter") {
        const key = process.env.OPENROUTER_API_KEY;
        if (!key) { results.push({ name, available: false, error: "No API key" }); continue; }
        try {
          await openaiCompletion(
            "https://openrouter.ai/api/v1/chat/completions",
            { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "HTTP-Referer": "https://feorm.na", "X-Title": "Feorm" },
            { model: "openrouter/free", messages: [{ role: "user", content: "ping" }], max_tokens: 5 }
          );
          ok = true;
        } catch {}
      }

      results.push({ name, available: ok, latencyMs: Date.now() - start });
    } catch (err: any) {
      results.push({ name, available: false, error: err?.message ?? "Unknown error" });
    }
  }

  return results;
}

// ──────────────────────────────────────────────
// Non-streaming completion (for suggest, describe, rewrite)
// ──────────────────────────────────────────────

export async function chatCompletion(
  messages: ChatMessage[],
  preferredProvider?: ProviderName
): Promise<ChatCompletionResult> {
  const order: ProviderName[] = preferredProvider
    ? [preferredProvider, ..."groq gemini openrouter zai".split(" ").filter((p) => p !== preferredProvider) as ProviderName[]]
    : ["openrouter", "groq", "gemini", "zai"];

  let lastError: Error | null = null;

  for (const providerName of order) {
    try {
      const start = Date.now();

      if (providerName === "groq") {
        const key = process.env.GROQ_API_KEY;
        if (!key) continue;
        const content = await openaiCompletion(
          "https://api.groq.com/openai/v1/chat/completions",
          { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          { model: "llama-3.3-70b-versatile", messages, temperature: 0.7, max_tokens: 1024 }
        );
        if (content) return { content, provider: "groq", model: "llama-3.3-70b-versatile", latencyMs: Date.now() - start };
      }

      if (providerName === "gemini") {
        const key = process.env.GEMINI_API_KEY;
        if (!key) continue;
        const content = await geminiCompletion(key, messages, "gemini-2.0-flash");
        if (content) return { content, provider: "gemini", model: "gemini-2.0-flash", latencyMs: Date.now() - start };
      }

      if (providerName === "openrouter") {
        const key = process.env.OPENROUTER_API_KEY;
        if (!key) continue;
        const content = await openaiCompletion(
          "https://openrouter.ai/api/v1/chat/completions",
          { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "HTTP-Referer": "https://feorm.na", "X-Title": "Feorm" },
          { model: "openrouter/free", messages, temperature: 0.7, max_tokens: 1024 }
        );
        if (content) return { content, provider: "openrouter", model: "openrouter/free", latencyMs: Date.now() - start };
      }

      if (providerName === "zai") {
        const content = await zaiCompletion(messages);
        if (content) return { content, provider: "zai", model: "glm-4-flash", latencyMs: Date.now() - start };
      }
    } catch (err) {
      lastError = err as Error;
      console.error(`[ai-providers] ${providerName} failed:`, (err as Error).message?.slice(0, 100));
      continue;
    }
  }

  throw lastError ?? new Error("All AI providers failed");
}

// ──────────────────────────────────────────────
// Streaming completion (for chat — avoids Vercel Hobby 10s timeout)
// ──────────────────────────────────────────────

export async function streamChatCompletion(
  messages: ChatMessage[],
  onChunk: (text: string, provider: string) => void,
  onDone: (provider: string, model: string) => void,
  preferredProvider?: ProviderName
): Promise<void> {
  const order: ProviderName[] = preferredProvider
    ? [preferredProvider, ..."groq gemini openrouter".split(" ").filter((p) => p !== preferredProvider) as ProviderName[]]
    : ["openrouter", "groq", "gemini"];

  for (const providerName of order) {
    try {
      if (providerName === "groq") {
        const key = process.env.GROQ_API_KEY;
        if (!key) continue;
        await openaiStream(
          "https://api.groq.com/openai/v1/chat/completions",
          { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          { model: "llama-3.3-70b-versatile", messages, temperature: 0.7, max_tokens: 1024, stream: true },
          (text) => onChunk(text, "groq")
        );
        onDone("groq", "llama-3.3-70b-versatile");
        return;
      }

      if (providerName === "gemini") {
        const key = process.env.GEMINI_API_KEY;
        if (!key) continue;
        await geminiStream(
          key,
          messages,
          "gemini-2.0-flash",
          (text) => onChunk(text, "gemini")
        );
        onDone("gemini", "gemini-2.0-flash");
        return;
      }

      if (providerName === "openrouter") {
        const key = process.env.OPENROUTER_API_KEY;
        if (!key) continue;
        await openaiStream(
          "https://openrouter.ai/api/v1/chat/completions",
          { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "HTTP-Referer": "https://feorm.na", "X-Title": "Feorm" },
          { model: "openrouter/free", messages, temperature: 0.7, max_tokens: 1024, stream: true },
          (text) => onChunk(text, "openrouter")
        );
        onDone("openrouter", "openrouter/free");
        return;
      }
    } catch (err) {
      console.error(`[ai-providers] ${providerName} streaming failed:`, (err as Error).message?.slice(0, 100));
      continue;
    }
  }

  // Fallback to z-ai non-streaming
  try {
    const content = await zaiCompletion(messages);
    if (content) {
      onChunk(content, "zai");
      onDone("zai", "glm-4-flash");
      return;
    }
  } catch (err) {
    console.error(`[ai-providers] z-ai fallback failed:`, err);
  }

  throw new Error("All AI providers failed for streaming");
}

# Task: Recreate 7 Missing Feorm AI Files

## Summary
Recreated all 7 missing files for the Feorm multi-provider AI abstraction layer and API routes.

## Files Created

1. **`/src/lib/ai-providers.ts`** — Multi-provider AI abstraction layer
   - 4 providers: OpenRouter, Groq, Gemini, z-ai (SDK)
   - OpenAI-compatible helpers for Groq and OpenRouter (POST with Bearer auth, SSE streaming)
   - Native Gemini API helpers (X-goog-api-key query param, contents format, systemInstruction, streamGenerateContent?alt=sse)
   - z-ai SDK helper with dynamic import and thinking: { type: "disabled" }
   - `checkProviders()` health check function
   - `chatCompletion()` with fallback chain: OpenRouter → Groq → Gemini → z-ai
   - `streamChatCompletion()` with streaming + fallback chain: OpenRouter → Groq → Gemini (streaming) → z-ai (non-streaming fallback)

2. **`/src/lib/tangison-prompt.ts`** — Tangison brand voice system prompt builder
   - `TANGISON_CORE_PROMPT` constant with full personality and knowledge base
   - `TangisonContext` interface (currentPage, userRole, region, userName, listingType)
   - `buildTangisonPrompt(context)` context-aware prompt assembly
   - `getTangisonFallback(lastMessage)` static fallback responses for 7 categories + default

3. **`/src/app/api/ai/chat/route.ts`** — SSE streaming chat endpoint
   - POST with messages, context, stream (default true)
   - SSE events: `data: {"type":"delta","text":"...","provider":"..."}` and `data: {"type":"done","provider":"...","model":"..."}`
   - Stream → non-stream fallback → static fallback chain
   - Non-streaming mode returns JSON

4. **`/src/app/api/ai/suggest/route.ts`** — Suggestion endpoint
   - Uses `chatCompletion()` from ai-providers
   - Role-based (voyager/provider) with static fallbacks

5. **`/src/app/api/ai/describe/route.ts`** — Listing description generator
   - Uses `chatCompletion()` from ai-providers
   - Template fallback with keyword-based feature matching

6. **`/src/app/api/ai/rewrite/route.ts`** — Listing copywriter
   - Uses `chatCompletion()` from ai-providers
   - Simple enhancement fallback when AI fails
   - Returns original, rewritten, provider

7. **`/src/app/api/ai/status/route.ts`** — Provider health check
   - `dynamic = "force-dynamic"`
   - GET handler calling `checkProviders()`
   - Returns providers array and timestamp

## Verification
- ESLint: No errors
- All 5 API endpoints tested via curl and returning 200:
  - `/api/ai/status` — Returns provider health with timestamp
  - `/api/ai/chat` (streaming) — Returns SSE events with fallback
  - `/api/ai/chat` (non-streaming) — Returns JSON with fallback
  - `/api/ai/suggest` — Returns 3 suggestions with region context
  - `/api/ai/describe` — Returns description, features, price range
  - `/api/ai/rewrite` — Returns original + rewritten with provider

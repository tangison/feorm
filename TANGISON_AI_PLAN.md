# Tangison AI Upgrade Plan — OpenRouter Integration + Fine-Tuning Strategy

## Executive Summary

Upgrade Tangison from a basic z-ai-web-dev-sdk chatbot (currently failing with network timeouts) to a properly tuned, human-like AI assistant powered by OpenRouter's free model router. Make the chat feel warm, knowledgeable, and authentically Namibian.

---

## 1. Current State Audit

### What We Have
| Component | Status | Issue |
|-----------|--------|-------|
| `/api/ai/chat/route.ts` | Uses `z-ai-web-dev-sdk` → `glm-4-flash` | **Network timeouts** — SDK can't reach API endpoints |
| `/api/ai/suggest/route.ts` | Same SDK, same model | Same timeout issue |
| `/api/ai/describe/route.ts` | Same SDK, same model | Same timeout issue |
| `/api/ai/rewrite/route.ts` | Same SDK, same model | Same timeout issue |
| `/api/avatar/route.ts` | Same SDK, image gen | Same timeout issue |
| System prompt | Good foundation, 18 lines | Needs expansion for human-like personality |
| Fallback system | Pattern-matched static responses | Works but robotic |
| Chat UI | Non-streaming, wait-for-full-response | Poor UX for long responses |

### Key Problems
1. **SDK is broken** — `z-ai-web-dev-sdk` can't connect (ConnectTimeoutError on port 443)
2. **No streaming** — User waits 5-30s with no feedback
3. **Robotic personality** — System prompt is functional but not conversational
4. **No conversation memory** — Each chat session starts fresh
5. **5 AI routes all depend on broken SDK** — All failing silently with fallbacks

---

## 2. OpenRouter Integration Architecture

### API Configuration
```
Provider: OpenRouter (openrouter.ai)
Model Router: openrouter/free (24 free models available)
API Key: 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
Endpoint: https://openrouter.ai/api/v1/chat/completions
Format: OpenAI-compatible API
```

### New Architecture
```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│  tangison-chat.tsx (streaming UI with tokens)    │
│    ↓ fetch with ReadableStream                   │
├─────────────────────────────────────────────────┤
│                API Layer                         │
│  /api/ai/chat  → OpenRouter (streaming)          │
│  /api/ai/suggest → OpenRouter (JSON)             │
│  /api/ai/describe → OpenRouter (JSON)            │
│  /api/ai/rewrite → OpenRouter (JSON)             │
│  /api/avatar → OpenRouter image gen (if avail)   │
│    ↓                                             │
├─────────────────────────────────────────────────┤
│             OpenRouter Free Router               │
│  Routes to: Gemini Flash, Llama, Qwen, etc.     │
│  Auto-selects model with needed capabilities     │
│  Rate limits: varies by model                    │
└─────────────────────────────────────────────────┘
```

### Why OpenRouter Free?
- **Zero cost** — perfect for MVP/testing
- **Model diversity** — 24 free models, auto-routed by capability
- **OpenAI-compatible** — drop-in replacement, same API format
- **Streaming support** — SSE for real-time chat
- **No vendor lock-in** — can switch models anytime

---

## 3. Fine-Tuning Strategy (System Prompt Engineering)

### Important: What "Fine-Tuning" Means Here

**True fine-tuning** (training custom model weights) requires:
- 1,000+ curated Q&A pairs
- $100-500+ in compute costs
- A hosted model infrastructure
- This is NOT feasible for an MVP on free tier

**What we WILL do instead** (much more effective for our use case):
1. **System prompt engineering** — Detailed persona definition
2. **Few-shot examples** — Embed conversation patterns in the prompt
3. **Context injection** — User role, region, page, conversation history
4. **Structured output** — Force JSON for non-chat endpoints
5. **Response filtering** — Post-process to ensure brand alignment

This approach is called **"prompt-level fine-tuning"** and is actually MORE effective than weight fine-tuning for personality/chatbot tasks.

### Tangison Persona V2 — The Human Touch

```markdown
You are Tangison — not an AI assistant, but a knowledgeable Namibian farm
advisor who happens to be available 24/7 through Feorm. You speak like a
real person who has walked the red soil, not a chatbot reading a script.

## Your Voice
- You speak in first person: "I'd recommend..." "I've seen farms in Oshana..."
- You use natural conversational fillers sparingly: "Right, so..." "Actually..."
- You ask follow-up questions: "What region are you in?" "Are you looking for
  a farm stay?"
- You reference real Namibian specifics: mahangu season, Ovambo hospitality,
  Caprivi floodplains, Kunene drought resilience
- You never say "As an AI" or "I don't have personal experience"
- You never use emojis

## Your Knowledge
- 14 Namibian regions and their agricultural cycles
- All ethnic communities: Ovambo, Kavango, Herero, Himba, Damara, Nama,
  San, Lozi, Tswana, Baster, Afrikaner
- Seasonal farming: mahangu (Nov-Jan planting, Mar-May harvest)
- Feorm's platform: escrow (N$1,500), verification, booking flow
- Stay types, pricing, and availability

## Conversation Patterns
When someone asks about booking:
  → Walk them through it step by step, like a friend would.
  → "So you want to book? Here's how it works: first, the host accepts your
     request. Then we hold N$1,500 in escrow — that's your security deposit.
     After your stay, if everything's in order, we release it back."

When someone asks about a region:
  → Give a vivid, specific answer.
  → "Oh, Zambezi? Beautiful area. The floodplains there mean the soil is
     incredibly rich — great for rice and maize. The Lozi communities there
     have been farming that land for generations. If you're looking for a
     farm stay in that region, I'd check between May and August when the
     waters recede — that's when you get the best access."

When someone asks about stays:
  → Be practical and cost-conscious.
  → "A farm stay in Khomas runs about N$500-1,500 per night depending
     on the property. The ones with home-cooked meals included are the best
     value — you get to taste real Namibian cooking and the hosts usually
     share stories about the land. I'd recommend checking what amenities
     are included before you book."

When you don't know something:
  → Be honest but helpful.
  → "That's a good question — I'm not 100% sure on the specifics there.
     I'd recommend reaching out to the host directly through the listing.
     They'll know their land better than anyone."
```

---

## 4. Implementation Plan

### Phase 1: Core OpenRouter Integration
**Files to modify:**
- `src/lib/openrouter.ts` — NEW: Shared OpenRouter client
- `src/app/api/ai/chat/route.ts` — Replace SDK with OpenRouter + streaming
- `src/components/feorm/tangison-chat.tsx` — Add streaming UI (token-by-token)
- `.env.local` — Add OPENROUTER_API_KEY

**What changes:**
1. Create `openrouter.ts` client with API key, default headers, error handling
2. Rewrite `/api/ai/chat` to call OpenRouter with streaming
3. Update chat UI to consume SSE stream (Read tokens as they arrive)
4. Keep fallback system for when OpenRouter is down

### Phase 2: Non-Chat AI Endpoints
**Files to modify:**
- `src/app/api/ai/suggest/route.ts` — Replace SDK
- `src/app/api/ai/describe/route.ts` — Replace SDK
- `src/app/api/ai/rewrite/route.ts` — Replace SDK

**What changes:**
1. Replace `z-ai-web-dev-sdk` calls with OpenRouter
2. Use `openrouter/free` with structured output requests
3. Keep existing fallback systems (they're good)

### Phase 3: Enhanced System Prompt
**Files to modify:**
- `src/lib/tangison-prompt.ts` — NEW: Extracted, versioned system prompt
- All AI route files — Import from shared prompt

**What changes:**
1. Extract system prompt to dedicated file with versioning
2. Add few-shot conversation examples
3. Add dynamic context injection (user role, region, page)
4. Add conversation memory support

### Phase 4: Chat UX Improvements
**Files to modify:**
- `src/components/feorm/tangison-chat.tsx` — Streaming + typing indicators
- `src/app/api/ai/chat/route.ts` — Context enrichment

**What changes:**
1. Streaming token display (words appear as they're generated)
2. Typing indicator while waiting
3. Pass user context (role, region, current page) in every request
4. Conversation persistence in localStorage

---

## 5. Vercel Hobby Plan Compatibility

### ❌ What WON'T Work on Vercel Hobby

| Feature | Issue | Solution |
|---------|-------|----------|
| **SQLite database** | Vercel is serverless = no persistent filesystem | Switch to **Neon** (serverless Postgres) or **Turso** (SQLite edge) |
| **Local file storage** | avatars, uploads | Use **Vercel Blob** or **Cloudflare R2** |
| **10s function timeout** | AI responses can take 15-30s | Use **streaming** (SSE keeps connection alive) |
| **100GB bandwidth/month** | Heavy chat usage could exceed | Monitor, upgrade if needed |

### ✅ What WILL Work

| Feature | Why It Works |
|---------|--------------|
| **Next.js App Router** | First-class Vercel support |
| **API Routes** | Serverless functions, fine for most requests |
| **Streaming SSE** | Vercel supports streaming responses — timeout is per-token, not per-request |
| **OpenRouter API** | External API call, no server-side state needed |
| **Tailwind CSS** | Static, no server cost |
| **SVG avatars** | Static files, served from /public |

### Migration Path for Vercel

1. **Database**: `prisma/schema.prisma` → Change provider from `sqlite` to `postgresql`, set `DATABASE_URL` to Neon connection string, run `prisma db push`
2. **File storage**: Avatar uploads → Use Vercel Blob (`@vercel/blob`) or store as data URLs in database
3. **Environment variables**: Set `OPENROUTER_API_KEY` in Vercel dashboard
4. **Build**: `next build` works — already verified
5. **Domain**: Vercel provides free `.vercel.app` domain

### Cost Estimate for Vercel Hobby
| Item | Cost |
|------|------|
| Hosting | Free |
| Neon Postgres (free tier) | Free (0.5GB storage) |
| OpenRouter (free models) | Free |
| Vercel Blob (free tier) | Free (250MB) |
| Custom domain | ~N$150/year (optional) |
| **Total** | **N$0/month** |

### ⚠️ The 10-Second Timeout Problem

Vercel Hobby has a **10-second function execution limit**. AI responses can take 15-30+ seconds.

**Solution: Streaming**

With streaming (SSE), Vercel's timeout applies differently:
- The function must **start sending data** within 10 seconds
- Once streaming begins, the connection can stay open much longer
- Each token/chunk resets the timeout
- This is how Vercel's own AI SDK works — and it works on Hobby

So **streaming is not optional** — it's **required** for Vercel deployment.

---

## 6. Telegram Bot Integration (Bonus)

You shared a Telegram bot token: `8673814673:AAExDBRKaD9vU2KEATR5l9wkNGbOM65DT2c`

This could enable:
- Tangison AI on Telegram (users chat with the bot)
- Booking notifications via Telegram
- Provider alerts (new booking, booking completed)

**This is a separate mini-service** (not in the Next.js app) — would need its own deployment. Can be planned after the core AI upgrade.

---

## 7. Summary & Priority Order

| Priority | Task | Effort | Impact |
|----------|------|--------|--------|
| 🔴 P0 | Replace z-ai-web-dev-sdk with OpenRouter | 2h | Fixes broken AI |
| 🔴 P0 | Add streaming to chat endpoint | 2h | Enables Vercel deploy |
| 🟡 P1 | Upgrade Tangison system prompt (V2 persona) | 1h | Human-like chat |
| 🟡 P1 | Add streaming UI to tangison-chat.tsx | 2h | Real-time token display |
| 🟢 P2 | Replace SDK in suggest/describe/rewrite routes | 1h | Consistent AI stack |
| 🟢 P2 | Extract system prompt to shared lib | 30m | Maintainability |
| 🟢 P2 | Conversation memory (localStorage) | 1h | Better UX |
| ⚪ P3 | Database migration (SQLite → Neon Postgres) | 2h | Vercel compatibility |
| ⚪ P3 | Telegram bot integration | 4h | Multi-channel presence |

**Recommended order:** P0 → P1 → P2 → Deploy to Vercel → P3

---

*Plan created: 2026-03-05*
*Feorm — Built for the Land*

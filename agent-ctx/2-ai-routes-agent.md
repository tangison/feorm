# Task 2 — AI Routes Agent

## Task
Create AI-powered API routes using z-ai-web-dev-sdk

## Files Created
1. `/home/z/my-project/src/app/api/ai/rewrite/route.ts` — POST endpoint for property description rewriting
2. `/home/z/my-project/src/app/api/ai/suggest/route.ts` — POST endpoint for smart suggestions
3. `/home/z/my-project/src/app/api/ai/describe/route.ts` — POST endpoint for listing enhancement

## Architecture Pattern
All three routes follow the same resilient pattern:
1. Parse and validate request body
2. Try `ZAI.create()` → `zai.chat.completions.create()` with `glm-4-flash`
3. Parse/validate the LLM JSON response
4. If SDK fails or response is invalid, fall back to deterministic template generation
5. Return structured JSON response

## Key Details

### /api/ai/rewrite
- Input: `{ title, description, type, region, category }`
- System prompt: Feorm editorial voice (authoritative, minimal, earth-toned, no exclamation marks)
- 120-word cap enforced on AI output
- Fallback: 3 contextual templates selected by title hash

### /api/ai/suggest
- Input: `{ role, interests, region }`
- Role-aware: voyagers get experience recommendations, providers get optimization tips
- Parses JSON array from LLM, validates categories (experience/equipment/optimization)
- Fallback: static contextual suggestions per role

### /api/ai/describe
- Input: `{ title, type }`
- Generates: editorial description + 4-6 feature tags + price range in N$ cents
- Fallback: keyword-based template with context-aware features and pricing

## Lint Status
All lint checks pass cleanly.

# Task 3-a: Color Migration (Auth Pages)

## Summary
Replaced all hardcoded hex colors with Feorm design system tokens in the auth pages section.

## Files Processed (13 total)
1. `(auth)/page.tsx` — 22 replacements
2. `(auth)/auth/verify/page.tsx` — 13 replacements
3. `(auth)/auth/terms/page.tsx` — 8 replacements
4. `(auth)/auth/role/page.tsx` — 12 replacements
5. `(auth)/auth/verify-id/page.tsx` — 6 replacements
6. `(auth)/auth/voyager/interests/page.tsx` — 9 replacements
7. `(auth)/auth/voyager/verify/page.tsx` — 8 replacements
8. `(auth)/auth/onboarding/page.tsx` — 8 replacements
9. `(auth)/auth/identity/page.tsx` — 16 replacements
10. `(auth)/auth/provider/assets/page.tsx` — 10 replacements
11. `(auth)/auth/provider/region/page.tsx` — 11 replacements
12. `(auth)/loading.tsx` — 3 replacements (bonus)
13. `(auth)/layout.tsx` — 0 replacements (already clean)

## Token Mappings Applied
| Hex | Token | Replacements |
|-----|-------|-------------|
| `#1E1A14` | `earth` | bg-earth, text-earth, border-earth, from-earth, via-earth, to-earth, hover:text-earth, hover:bg-earth, focus-within:border-earth, accent-earth, ring-earth |
| `#3C2F1A` | `soil` | border-soil/5, border-soil/10, border-soil/20, text-soil, hover:border-soil/20, ring-soil/10 |
| `#E8C96A` | `harvest` | text-harvest, border-harvest, bg-harvest, hover:border-harvest, group-hover:bg-harvest, ring-harvest, border-harvest/20 |
| `#D4C4A0` | `sand` | text-sand, border-sand, placeholder-sand, bg-sand, border-sand/50 |
| `#FAF7F2` | `fog` | bg-fog, hover:bg-fog |
| `#FEFDFB` | `white-feorm` | bg-white-feorm, text-white-feorm, group-hover:text-white-feorm, ring-offset-white-feorm |
| `#787774` | `muted-foreground` | text-muted-foreground, border-muted-foreground |
| `#9F2F2D` | `destructive` | text-destructive |
| `#956400` | `accent-foreground` | text-accent-foreground |
| `#FBF3DB` | `accent` | bg-accent, bg-accent/30 |

## Intentional Exceptions (kept as inline hex)
- `#346538` — No Tailwind token; used for verified green elements in non-tag contexts
- `#EDF3EC` — No Tailwind token; tag-verified class inappropriate for non-tag contexts
- `#1F6C9F` — No Tailwind token; mapping says "Keep or use inline"
- `#E1F3FE` — No Tailwind token; tag-machinery class inappropriate for non-tag contexts

## Verification
- `bun run lint` — clean
- No functionality changes, only color reference updates

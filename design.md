# Feorm Design System

> Premium Utilitarian Minimalism — Built for the Land

---

## 1. Philosophy

Feorm's design is rooted in the Namibian landscape: earth tones, wide-open spaces, and honest materials. Every visual decision traces back to the land — dark soil, sun-bleached sand, golden harvest, and the fog of early morning veld. The UI avoids decoration for its own sake. Information is dense but breathable. Interactions feel physical — subtle lifts, gentle reveals, no gratuitous animation.

**Core Principles:**

- **Land-first palette** — Every color is named after a Namibian natural element
- **Premium restraint** — White space is design, not waste. Maximum 3 decorative elements per view
- **Mobile-native** — Bottom tab bar, floating sheets, safe-area-aware. Desktop is the progressive enhancement
- **Typographic hierarchy** — Serif for emotion, sans for function, mono for data
- **Accessibility** — WCAG 2.1 AA contrast minimum, 44px touch targets, skip-to-content, focus-visible rings

---

## 2. Color System

### 2.1 Primitive Tokens (Feorm Palette)

These 8 colors form the entire chromatic foundation. Every other color in the system derives from these.

| Token | Hex | Name | Description |
|-------|-----|------|-------------|
| `--color-earth` | `#1E1A14` | Earth | Darkest. Primary text, active states, sidebar active background. The Namibian soil after rain. |
| `--color-soil` | `#3C2F1A` | Soil | Secondary text, chart bars, mid-depth elements. Wet earth beneath the surface. |
| `--color-bark` | `#5C4A2A` | Bark | Tertiary depth, muted emphasis, chart secondary. Acacia bark in dry season. |
| `--color-harvest` | `#E8C96A` | Harvest | Accent, ring focus, brand dot, active indicators. Millet and maize at harvest. |
| `--color-sand` | `#D4C4A0` | Sand | Disabled text, subtle borders, scrollbar. Kalahari sand at midday. |
| `--color-cream` | `#F2EDE2` | Cream | Secondary background, muted surfaces. Freshly churned earth. |
| `--color-fog` | `#FAF7F2` | Fog | Hover states, avatar backgrounds, subtle fills. Morning fog over the veld. |
| `--color-white-feorm` | `#FEFDFB` | White Feorm | Card surfaces, popover backgrounds. Not pure white — warm like bone. |

**Usage rule:** Never introduce a new hex value. If you need a shade between two tokens, use `color-mix(in srgb, var(--color-earth) 50%, var(--color-soil))` or Tailwind opacity modifiers (`text-earth/60`, `bg-harvest/10`).

### 2.2 Semantic Tokens (shadcn/ui Layer)

These map the Feorm palette to the shadcn/ui component system. All shadcn components consume these variables.

| Token | Value | Purpose |
|-------|-------|---------|
| `--background` | `#FAF7F2` | Page background (fog) |
| `--foreground` | `#1E1A14` | Primary text (earth) |
| `--card` | `#FEFDFB` | Card background (white-feorm) |
| `--card-foreground` | `#1E1A14` | Card text (earth) |
| `--popover` | `#FEFDFB` | Popover background |
| `--popover-foreground` | `#1E1A14` | Popover text |
| `--primary` | `#1E1A14` | Primary button/action (earth) |
| `--primary-foreground` | `#FEFDFB` | Text on primary (white-feorm) |
| `--secondary` | `#F2EDE2` | Secondary surfaces (cream) |
| `--secondary-foreground` | `#1E1A14` | Text on secondary |
| `--muted` | `#F2EDE2` | Muted surfaces (cream) |
| `--muted-foreground` | `#787774` | Muted/deemphasized text |
| `--accent` | `#FBF3DB` | Accent backgrounds (harvest tint) |
| `--accent-foreground` | `#956400` | Text on accent |
| `--destructive` | `#9F2F2D` | Error/destructive actions |
| `--border` | `rgba(60, 47, 26, 0.08)` | Default borders |
| `--input` | `rgba(60, 47, 26, 0.15)` | Input borders |
| `--ring` | `#E8C96A` | Focus ring (harvest) |
| `--chart-1` through `--chart-5` | Earth → Sand gradient | Recharts palette |

### 2.3 Domain-Specific Semantic Tokens

These encode domain meanings beyond the generic shadcn layer.

| Token | Hex | Meaning | Usage |
|-------|-----|---------|-------|
| `--color-verified` | `#346538` | Verified/trust status | Verification badges, trust indicators |
| `--color-verified-bg` | `#EDF3EC` | Verified background | Tag backgrounds, status panels |
| `--color-verified-hover` | `#dde9dd` | Verified hover | Hover state for verified elements |
| `--color-destructive-bg` | `#FDEBEC` | Error background | Error panels, alert backgrounds |
| `--color-destructive-hover` | `#f5d5d6` | Error hover | Hover state for destructive elements |
| `--color-destructive-dark` | `#8a2826` | Deep error | Strong error emphasis |
| `--color-whatsapp` | `#25D366` | WhatsApp brand | WhatsApp contact buttons |
| `--color-whatsapp-bg` | `rgba(37, 211, 102, 0.05)` | WhatsApp background | WhatsApp button background |


### 2.4 Color Application Rules

1. **Text always uses `earth`, `soil`, or `muted-foreground`** — never `bark` or `harvest` for body text
2. **Backgrounds use `white-feorm`, `fog`, or `cream`** in that order of elevation
3. **`harvest` is the sole accent** — used for focus rings, active indicators, and the brand dot in "feorm."
4. **Opacity modifiers for depth:** `text-earth/60` for secondary, `bg-earth/5` for hover, `border-earth/8` for subtle dividers
5. **No dark mode** — the entire palette is light-mode only, designed for outdoor readability

---

## 3. Typography

### 3.1 Font Stack

| Role | Family | Variable | Weights | Usage |
|------|--------|----------|---------|-------|
| **Display/Serif** | DM Serif Display | `--font-dm-serif` | 400 (regular), italic | Headings, brand name, emotional titles |
| **Body/Sans** | DM Sans | `--font-dm-sans` | 300, 400, 500, 600 | Body text, buttons, labels, form inputs |
| **Mono/Data** | JetBrains Mono | `--font-jetbrains-mono` | 400, 500 | Prices, specs, metadata, region codes, tags |

All fonts loaded via `next/font/google` with `display: swap` for zero layout shift.

### 3.2 Typographic Scale

| Level | Class | Size | Weight | Family | Tracking | Usage |
|-------|-------|------|--------|--------|----------|-------|
| Hero | `font-serif-display` | 3xl-5xl | 400 | Serif | -0.02em | Page titles ("Farm Stays") |
| H2 | `font-serif-display` | xl-2xl | 400 | Serif | -0.02em | Section headings, listing titles |
| Body | default | sm-base | 400 | Sans | normal | Paragraph text, descriptions |
| Label | `font-mono-feorm` | 8-10px | 500-600 | Mono | 0.06-0.1em | Nav items, tags, region codes, metadata |
| Spec | `.spec-label` | 10px | 400 | Mono | 0.1em | Tiny uppercase labels (spec keys, field labels) |
| Price | `font-mono-feorm` | sm | 500 | Mono | normal | Price displays |

### 3.3 Typographic Rules

1. **Serif is for emotion** — only headings and the brand name use `font-serif-display`
2. **Mono is for data** — prices, regions, nav labels, and metadata use `font-mono-feorm`
3. **All labels are uppercase with tracking** — `text-[8px] uppercase tracking-widest font-medium`
4. **Line-height 1.1 on serif headings** — tight leading creates the premium editorial feel
5. **Never mix more than 2 font families in a single component** — serif + mono or sans + mono only

---

## 4. Layout System

### 4.1 Page Architecture

```
┌─────────────────────────────────────────────────┐
│ Mobile Header (48px fixed top)                  │
│ Logo .............. Role Badge + Avatar          │
├─────────────────────────────────────────────────┤
│                                                 │
│  Content Area                                   │
│  max-w-6xl mx-auto px-4 md:px-6                │
│  py-6 md:py-12 lg:py-16                         │
│                                                 │
│  Desktop: left margin 240px (sidebar width)     │
│                                                 │
├─────────────────────────────────────────────────┤
│ Floating Bottom Nav (56px + 16px offset)        │
│ [Tab 1]    [Tab 2]    [Tab 3]                  │
└─────────────────────────────────────────────────┘
```

### 4.2 Breakpoints

| Breakpoint | Tailwind | Layout |
|------------|----------|--------|
| Mobile | default (<1024px) | Top header + bottom tab bar + sheet menu |
| Desktop | `lg:` (>=1024px) | 240px fixed sidebar + full content area |

There is no intermediate tablet breakpoint. The app is either mobile (stacked) or desktop (sidebar).

### 4.3 Desktop Sidebar (240px)

- Fixed position, full height, left edge
- Brand mark at top, nav items in scrollable middle, user + sign out at bottom
- Active state: `bg-earth text-white-feorm` with `text-harvest` icon
- Inactive: `text-muted-foreground` with `text-sand` icon, hover `bg-fog`

### 4.4 Mobile Navigation

- **Top header:** 48px, `bg-white-feorm/90 backdrop-blur-xl`, brand left, role badge + avatar right
- **Bottom tab bar:** 56px + 16px bottom offset, floating with `rounded-2xl shadow-lg`, 3 tabs
- **More menu:** Bottom sheet that slides up from bottom, backdrop blur, handle bar at top
- **Safe area:** `env(safe-area-inset-bottom)` for iPhone notch/home indicator

### 4.5 Content Spacing

| Context | Padding | Gap |
|---------|---------|-----|
| Page container | `px-4 md:px-6` | — |
| Page vertical | `py-6 md:py-12 lg:py-16` | — |
| Card grid | — | `gap-4 md:gap-6` |
| Card internal | `p-3.5 md:p-5` | — |
| Section headings | `mb-5 md:mb-8` | — |
| Form groups | — | `gap-4` |

### 4.6 Grid System

Farm stay listing grid:
```
grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6
```

Maximum content width: `max-w-6xl` (1152px)

---

## 5. Component Library

### 5.1 Custom Feorm Components

#### Bento Card (`.bento-card`)

The primary surface component. Clean, minimal, barely-there.

```css
.bento-card {
  background: var(--color-white-feorm);
  border: 1px solid rgba(60, 47, 26, 0.06);
  border-radius: 8px;
  box-shadow: none;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  contain: layout style paint;
}
.bento-card:hover {
  box-shadow: 0 2px 16px rgba(30, 26, 20, 0.04);
}
```

- **No shadow at rest** — cards distinguish themselves by border only
- **Subtle lift on hover** — `translateY(-1px)` via `.bento-card-lift`
- **8px border-radius** — consistent with `--radius-lg` (0.5rem)
- **CSS containment** — `contain: layout style paint` for rendering performance

#### Buttons

| Class | Style | Usage |
|-------|-------|-------|
| `.btn-primary-feorm` | Earth bg, white-feorm text, pill shape | Primary CTAs |
| `.btn-harvest` | Harvest bg, earth text, pill shape, darken on hover | Accent CTAs, golden actions |
| `.btn-secondary-feorm` | Transparent, thin border, pill shape | Secondary actions, filter toggles |

All buttons:
- `border-radius: 9999px` (pill shape)
- Active state: `scale(0.97)` for tactile press feel
- Minimum touch target: `min-h-[36px]` for filters, `min-h-[40px]` for main actions
- Transition: `cubic-bezier(0.16, 1, 0.3, 1)` — spring-like ease-out

#### Tags

| Class | Background | Text | Usage |
|-------|-----------|------|-------|
| `.tag-pastel` | `--accent` (#FBF3DB) | `--accent-foreground` | Farm stay category, voyager badge |
| `.tag-verified` | `--color-verified-bg` | `--color-verified` | Trust indicators, provider badge |
| `.tag-alert` | `--color-destructive-bg` | `--destructive` | Errors, warnings |

All tags: `border-radius: 9999px`, `letter-spacing: 0.05em`, `text-transform: uppercase`

#### Listing Card

```
┌─────────────────────────────────┐
│  [Image 400×300, lazy loaded]   │
│  ┌──────────┐                   │
│  │ Category │  tag-pastel       │
│  └──────────┘                   │
├─────────────────────────────────┤
│  REGION                         │  ← mono 9px uppercase
│  Listing Title                  │  ← serif display lg
│                                 │
│  N$500 / day          [→]      │  ← mono price + arrow circle
└─────────────────────────────────┘
```

- Image has `opacity-90` at rest, subtle scale on hover (`scale-[1.03]`)
- Arrow circle inverts to earth/white-feorm on hover
- Memo'd with `React.memo()` for list virtualization

#### Navigation Bar

- Mobile: floating pill with `bg-white-feorm/95 backdrop-blur-xl rounded-2xl shadow-lg shadow-earth/8`
- Active tab: `text-earth` with `bg-harvest` dot indicator below
- Inactive: `text-muted-foreground`

### 5.2 shadcn/ui Components

The project uses 16 shadcn/ui primitives, all styled through CSS variables:

| Component | Location | Notes |
|-----------|----------|-------|
| Avatar | `components/ui/avatar.tsx` | Installed but unused — Feorm uses custom avatar rendering |
| Badge | `components/ui/badge.tsx` | For status indicators |
| Button | `components/ui/button.tsx` | CVA variants: default, destructive, outline, secondary, ghost, link |
| Card | `components/ui/card.tsx` | Alternative to `.bento-card` for form sections |
| Checkbox | `components/ui/checkbox.tsx` | Filter toggles, feature lists |
| Dialog | `components/ui/dialog.tsx` | Modal overlays |
| Dropdown Menu | `components/ui/dropdown-menu.tsx` | Context menus |
| Form | `components/ui/form.tsx` | react-hook-form integration |
| Input | `components/ui/input.tsx` | Text fields |
| Label | `components/ui/label.tsx` | Form labels |
| Popover | `components/ui/popover.tsx` | Tooltip/overlay content |
| Progress | `components/ui/progress.tsx` | Upload/verification progress |
| Scroll Area | `components/ui/scroll-area.tsx` | Custom scrollable regions |
| Select | `components/ui/select.tsx` | Dropdown selectors |
| Separator | `components/ui/separator.tsx` | Dividers |
| Sheet | `components/ui/sheet.tsx` | Slide-in panels |
| Skeleton | `components/ui/skeleton.tsx` | Loading placeholders |
| Tabs | `components/ui/tabs.tsx` | Tabbed content |
| Textarea | `components/ui/textarea.tsx` | Multi-line text fields |
| Toast | `components/ui/toast.tsx` | Notification toasts |

### 5.3 Icon System

**Library:** Lucide React v0.525.0 — 42 icons in use

**Size conventions:**

| Context | Size | Stroke Width |
|---------|------|-------------|
| Nav items | 15-20px | 1.5 (inactive), 2.2 (active) |
| Inline actions | 12-14px | 1.5 |
| Empty states | 32-48px | 1.0 |
| Buttons | 16-18px | 1.5 |

**Key icons by domain:**
- Farm stays: `Tent`, `ArrowUpRight`, `SlidersHorizontal`
- Trust: `Shield`, `ShieldCheck`, `Award`, `CheckCircle2`
- Navigation: `MapPin`, `Clock`, `LayoutDashboard`, `Compass`
- AI: `Sparkles`, `Zap`, `Send` (Tangison chat)
- Actions: `Upload`, `Camera`, `Download`, `LogOut`

---

## 6. Animation & Motion

### 6.1 Easing

All Feorm animations use a single easing curve: `cubic-bezier(0.16, 1, 0.3, 1)` — a spring-like ease-out that feels physical without bouncing.

### 6.2 Animation Library

| Animation | Duration | Trigger | Usage |
|-----------|----------|---------|-------|
| `feorm-reveal` | 0.4-0.5s | Page load | Elements fade up 8px |
| `feorm-slide-up` | 0.25s | Sheet open | Bottom sheet slides up 16px |
| `feorm-scale-in` | 0.3s | Page transition | Content scales from 0.99 |
| `stagger-reveal` | 50ms increments | List render | Children animate sequentially (up to 12) |
| `shimmer` | 1.5s infinite | Loading | Skeleton placeholder pulse |
| Card hover | 0.2s | Hover | `translateY(-1px)` + shadow |
| Image hover | 0.5s ease-out | Hover | `scale(1.03)` + slight overlay |

### 6.3 Reduced Motion

All animations respect `prefers-reduced-motion: reduce`:
```css
@media (prefers-reduced-motion: reduce) {
  .reveal, .stagger-reveal > *, .skeleton-shimmer { animation: none; opacity: 1; transform: none; }
  .page-enter { animation: none; }
  .bento-card:hover { transform: none; }
}
```

### 6.4 Motion Rules

1. **No animation longer than 0.5s** — everything should feel instant
2. **No bounce or elastic easing** — physical, not playful
3. **Stagger maximum 12 items** — beyond that, just reveal all
4. **Transform only** — animate `opacity` and `transform` only, never `width`, `height`, or `top/left`

---

## 7. Avatar System

### 7.1 Humanoid Avatars (Primary)

5 illustrated SVG characters representing Namibian identities. Users pick one during onboarding.

| ID | Name | Role | Ring Color | SVG Background |
|----|------|------|------------|----------------|
| `avatar://amara` | Amara | Farmer & Host | `ring-harvest` | `#FBF3DB` (accent) |
| `avatar://kazo` | Kazo | Explorer & Guide | `ring-bark` | `#F2EDE2` (cream) |
| `avatar://tandi` | Tandi | Community Leader | `ring-harvest` | `#EDF3EC` (verified-bg) |
| `avatar://shona` | Shona | Elder & Mentor | `ring-sand` | `#FAF7F2` (fog) |
| `avatar://nale` | Nale | Adventurer | `ring-earth` | `#FBF3DB` (accent) |

- SVG format, 200x200 viewBox, ~4KB each
- Stored in `public/avatars/*.svg`
- Skin tones: `#C68642`, `#8D5524`, `#A0673C` — representative of Namibian people
- Rendered via `next/image` at various sizes: 28px (nav), 40px (sheet), 56px (picker), 80px (profile), 96px (onboarding preview)

### 7.2 Legacy Systems (Deprecated but Supported)

| Protocol | Format | Migration |
|----------|--------|-----------|
| `emoji://` | Emoji character | Auto-migrated to Amara humanoid at display layer |
| `preset://` | CSS linear-gradient | 8 gradients still render if referenced |
| Data URL | Compressed JPEG | User-uploaded photo, compressed to 512px, 0.8 quality |

### 7.3 Avatar Resolution Logic

```typescript
resolveAvatarDisplay(avatarUrl) →
  "avatar://..." → humanoid (SVG path)
  "emoji://..."  → humanoid (Amara fallback)
  "preset://..." → preset (gradient)
  otherwise      → image (data URL or external)
```

---

## 8. Imagery

### 8.1 Current Asset Inventory

| Category | Count | Location | Status |
|----------|-------|----------|--------|
| Brand logo (PNG) | 1 | `public/feorm-logo.png` (160x154) | Active — favicon, nav, footer |
| Hero background | 1 | `public/images/hero-gateway.png` (1344x768) | Active — auth page full-bleed |
| Humanoid avatars | 5 | `public/avatars/*.svg` (200x200) | Active — onboarding, profile |
| Avatar placeholder | 1 | `public/images/avatar-placeholder.png` (1024x1024) | Fallback for failed generation |
| Demo listing images | 20 | `public/images/stay-*.png`, `equip-*.png` | To be removed (AI-generated) |
| Runtime avatars | 4 | `public/avatars/avatar-*.png` | To be removed (accumulated) |

### 8.2 Image Rendering

All images use Next.js `<Image>` component — zero raw `<img>` tags in the codebase.

| Context | Width | Height | Loading | Sizes |
|---------|-------|--------|---------|-------|
| Listing card | 400 | 300 | Lazy | `(max-width: 768px) 100vw, 50vw, 33vw` |
| Listing detail hero | 600 | 450 | Eager | — |
| Auth hero | fill | fill | Eager | Full viewport |
| Avatar (nav) | 28-32 | 28-32 | Eager | Fixed |
| Avatar (picker) | 56 | 56 | Eager | Fixed |
| Logo | 20-24 | 20-24 | Eager | Fixed |

### 8.3 Image Guidelines for Vercel

1. **Use WebP where possible** — Vercel's Next.js Image Optimization auto-converts to WebP/AVIF
2. **Remote patterns** — `next.config.ts` allows all HTTPS hosts (`hostname: "**"`)
3. **Local images** — Store in `public/images/` for automatic optimization
4. **No external CDN required** — Vercel handles image optimization at the edge
5. **`sharp` is installed** — enables server-side image processing on Vercel
6. **Avoid `/api/avatar` runtime generation** — generates PNGs that accumulate in `public/avatars/` with no cleanup. This will fail on Vercel's read-only filesystem

### 8.4 Where Images Need to Be Added

See the imagery audit for the full prescription. Priority locations:

1. **Auth hero background** — Replace `hero-gateway.png` with a real Namibian panorama (Sossusvlei, Etosha, Fish River Canyon)
2. **Farm stay category banners** — Wide landscape banners above the listing grid
3. **Listing detail gallery** — Support 3-5 images per listing with a hero + thumbnails layout
4. **Empty state illustrations** — SVG illustrations with Namibian motifs (acacia, welwitschia, desert fox)
5. **Onboarding backgrounds** — Region-specific imagery for each Namibian region
6. **Footer color strip enhancement** — Landscape thumbnails in each palette swatch

---

## 9. Spacing & Sizing

### 9.1 Spacing Scale

Feorm uses Tailwind's default spacing scale with consistent patterns:

| Token | Value | Usage |
|-------|-------|-------|
| `0.5` | 2px | Tiny gaps, icon-to-text |
| `1` | 4px | Tight element spacing |
| `1.5` | 6px | Card image padding |
| `2` | 8px | Small gaps, tag padding |
| `2.5` | 10px | Nav item gaps |
| `3` | 12px | Medium gaps |
| `3.5` | 14px | Card content padding |
| `4` | 16px | Standard gaps, button padding |
| `5` | 20px | Section spacing (mobile) |
| `6` | 24px | Section spacing (desktop) |
| `8` | 32px | Large section breaks |
| `10` | 40px | Page-level breaks |
| `12` | 48px | Major sections |
| `16` | 64px | Page padding (desktop) |

### 9.2 Touch Targets

All interactive elements have minimum 36-44px touch area:
- Buttons: `min-h-[40px]` (primary), `min-h-[36px]` (filters)
- Nav tabs: `min-h-[44px]`
- Menu items: `min-h-[44px]`
- Icon buttons: `min-w-[36px] min-h-[36px]`

### 9.3 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Small elements |
| `--radius-md` | 6px | Inputs, select |
| `--radius-lg` | 8px | Cards, dialog |
| `--radius-xl` | 12px | Large containers |
| `rounded-full` | 9999px | Buttons, tags, avatars |

---

## 10. Border & Shadow System

### 10.1 Borders

| Context | Value | Visual |
|---------|-------|--------|
| Card | `1px solid rgba(60, 47, 26, 0.06)` | Barely visible |
| Section dividers | `border-earth/5` | Subtle |
| Input focus | `border-earth/15` | Slightly stronger |
| Active nav | Solid earth | Full contrast |

### 10.2 Shadows

| Context | Value | Usage |
|---------|-------|-------|
| Card hover | `0 2px 16px rgba(30, 26, 20, 0.04)` | Barely-there lift |
| Bottom nav | `shadow-lg shadow-earth/8` | Floating elevation |
| More sheet | `shadow-2xl` | Maximum elevation |
| None (default) | `box-shadow: none` | Cards at rest |

**Rule:** No colored shadows. All shadows use `rgba(30, 26, 20, ...)` (earth with opacity).

---

## 11. Accessibility

### 11.1 Compliance Target

WCAG 2.1 Level AA. This means:

- **Contrast ratio** minimum 4.5:1 for normal text, 3:1 for large text
- **Focus visible** on all interactive elements (2px harvest ring, 2px offset)
- **Skip to content** link (`.skip-link`) on every page
- **Semantic HTML** — landmarks, headings, lists, labels
- **ARIA** — `aria-current="page"`, `aria-expanded`, `aria-label`, `role="navigation"`

### 11.2 Current Accessibility Features

| Feature | Implementation | Location |
|---------|---------------|----------|
| Skip link | `.skip-link` class, focusable at top | `layout.tsx` |
| Focus ring | `2px solid var(--ring)` with 2px offset | `globals.css` |
| Reduced motion | All animations disabled | `globals.css` |
| Touch targets | Minimum 36-44px | All interactive elements |
| Safe area | `env(safe-area-inset-bottom)` | Bottom nav |
| Semantic nav | `role="navigation"`, `aria-label` | Nav component |
| Image alt text | Descriptive `alt` on all images | All `<Image>` components |
| Keyboard escape | Close menus on Escape key | More menu, dropdowns |

### 11.3 Known Gaps

- No screen reader testing done yet
- Color-only indicators (active dot) need additional non-color cues
- Form validation errors need `aria-invalid` and `aria-describedby`
- Focus trap missing in bottom sheet

---

## 12. Route & Page Structure

### 12.1 Route Groups

| Group | Path | Layout | Auth Required |
|-------|------|--------|---------------|
| Auth | `/(auth)/auth/*` | Centered card, hero background | No |
| Farm Stays | `/(marketplace)/*` | Nav + content + footer | Yes |
| Root | `/` | Loading → redirect | No |

### 12.2 All Routes

| Route | Page | Key Visual Elements |
|-------|------|---------------------|
| `/` | Landing → redirect | Spinner |
| `/auth` | Sign in / sign up | Full-bleed hero image, centered card |
| `/auth/role` | Role selection | Compass/Tractor icons, split cards |
| `/auth/identity` | Avatar picker | 5 humanoid avatars, camera upload |
| `/auth/verify` | Phone OTP | Input field, countdown |
| `/auth/onboarding` | Welcome | CheckCircle animation |
| `/auth/terms` | Terms of service | Scrollable text |
| `/auth/verify-id` | ID upload | Upload zone with Camera icon |
| `/auth/voyager/interests` | Interest selection | Region tags |
| `/auth/voyager/verify` | Voyager verification | Download/Upload buttons |
| `/auth/provider/assets` | Asset listing | Upload, Tent icons |
| `/auth/provider/region` | Region selection | MapPin, region list |
| `/marketplace` | Listing grid | Toggle tabs, filter chips, listing cards |
| `/listing/[id]` | Listing detail | Hero image, WhatsApp button, booking CTA |
| `/listing/[id]/book` | Booking flow | Escrow display, date picker |
| `/booking/success` | Booking confirmed | CheckCircle, WhatsApp link |
| `/dashboard` | Provider dashboard | Revenue chart, utilization bars, listing cards |
| `/journeys` | Voyager trips | Trip cards, Clock icon |
| `/profile` | User profile | Avatar picker, settings list |
| `/verification` | Trust verification | Shield/Award icons, progress steps |
| `/settings` | App settings | FileJson, Info, RotateCcw icons |
| `/support` | Help & contact | Phone, MessageCircle icons |

---

## 13. State Management

### 13.1 Context Architecture

4 independent React Context providers, composed in `FeormProvider`:

```
FeormProvider
  └── FeormAuthProvider      — user, avatarUrl, session
      └── FeormMarketProvider — listings, marketView, filters
          └── FeormBookingProvider — bookings, escrow
              └── FeormOnboardingProvider — role, onboarding progress
```

Each provider is independent — consumers only re-render when their specific context changes.

### 13.2 Data Flow

```
Supabase DB → hooks/use-listings.ts → FeormMarketProvider → ListingCard
               hooks/use-bookings.ts → FeormBookingProvider → Journey cards
```

- `useListings(type)` fetches from Supabase via `utils/supabase/client.ts`
- `useBookings()` fetches user bookings
- All hooks use `@tanstack/react-query`-style patterns (fetch + cache + state)

---

## 14. Vercel Deployment

### 14.1 Build Configuration

| Setting | Value | Notes |
|---------|-------|-------|
| Framework | Next.js 16 | Auto-detected by Vercel |
| Build command | `next build` | Default |
| Output directory | `.next` | Default |
| Node.js version | 18.x | Vercel default |
| Region | Auto (or set to `sa-east-1` to match Supabase) | |

### 14.2 Environment Variables (Vercel Dashboard)

These MUST be configured in Vercel Project Settings → Environment Variables:

| Variable | Example Value | Required |
|----------|--------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://exftukrcibzrudguukik.supabase.co` | Yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_JROSuXnobakfzVq9xeSVog_8tOpTM8g` | Yes |
| `OPENROUTER_API_KEY` | `sk-or-v1-...` | Yes |

**Do NOT commit `.env.local` to Git.** It is already in `.gitignore`.

### 14.3 Vercel-Specific Considerations

1. **Read-only filesystem** — The `/api/avatar` route that writes PNGs to `public/avatars/` will fail on Vercel. Avatar generation must use Supabase Storage or a signed URL approach instead.
2. **Serverless functions** — All API routes run as serverless functions. No persistent connections. Supabase client must create fresh connections per request.
3. **Image optimization** — Vercel automatically optimizes images via Next.js `<Image>`. The `sharp` package enables this. No external loader needed.
4. **Middleware** — `src/middleware.ts` runs at the edge for Supabase session refresh. This is already configured.
5. **No `vercel.json` needed** — Next.js 16 with App Router is auto-configured.

### 14.4 Deployment Checklist

- [ ] Push to `main` branch on GitHub
- [ ] Connect repo to Vercel (import from GitHub)
- [ ] Set all 3 environment variables in Vercel dashboard
- [ ] Verify build succeeds (check for TypeScript errors)
- [ ] Verify Supabase connection works (middleware session refresh)
- [ ] Verify image optimization works (check `_next/image` URLs)
- [ ] Test auth flow end-to-end on Vercel URL

---

## 15. Technical Stack Summary

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | Next.js | 16.1.1 | App Router, Turbopack |
| Language | TypeScript | 5.x | Strict mode |
| Styling | Tailwind CSS | 4.x | With `@tailwindcss/postcss` |
| Animation | tw-animate-css | 1.3.5 | Tailwind animation utilities |
| UI Primitives | Radix UI | Various | 10 primitives |
| Component System | shadcn/ui | Custom | 20 components |
| Icons | Lucide React | 0.525.0 | 42 icons used |
| Charts | Recharts | 2.15.4 | Dashboard revenue chart |
| Forms | react-hook-form + zod | 7.60 / 4.0 | Validation |
| Database | Supabase (PostgreSQL) | — | Via `@supabase/supabase-js` 2.107 |
| Auth | Supabase Auth | — | Via `@supabase/ssr` 0.10.3 |
| AI | OpenRouter | — | Single provider (consolidated) |
| Image Processing | sharp | 0.34.3 | Server-side optimization |
| Package Manager | bun | 1.3.4 | bun.lock present |
| Deployment | Vercel | — | Auto-deploy from GitHub main |

---

## 16. File Structure (Design-Relevant)

```
feorm/
├── public/
│   ├── feorm-logo.png              # Brand mark (160x154)
│   ├── logo.svg                    # Orphaned — remove
│   ├── tangison-avatar.png         # Orphaned — remove
│   ├── avatars/
│   │   ├── amara.svg               # Humanoid avatar
│   │   ├── kazo.svg
│   │   ├── nale.svg
│   │   ├── shona.svg
│   │   └── tandi.svg
│   └── images/
│       ├── hero-gateway.png        # Auth page background
│       ├── avatar-placeholder.png  # Fallback avatar
│       ├── stay-*.png              # Demo listing images (remove)
│       └── equip-*.png             # Demo listing images (remove)
├── src/
│   ├── app/
│   │   ├── globals.css             # ALL design tokens + utilities
│   │   ├── layout.tsx              # Font loading, metadata, providers
│   │   ├── (auth)/                 # Auth route group
│   │   └── (marketplace)/          # Main app route group
│   ├── components/
│   │   ├── feorm/                  # Custom Feorm components
│   │   │   ├── nav.tsx             # Navigation (mobile + desktop)
│   │   │   ├── footer.tsx          # Footer with color strip
│   │   │   ├── listing-card.tsx    # Marketplace card
│   │   │   ├── tangison-chat.tsx   # AI chat FAB
│   │   │   ├── lazy-tangison-chat.tsx
│   │   │   └── revenue-chart.tsx   # Dashboard chart
│   │   └── ui/                     # shadcn/ui primitives (20 files)
│   ├── context/                    # React Context providers
│   │   ├── feorm-context.tsx       # Provider composition
│   │   ├── feorm-auth.tsx          # Auth state
│   │   ├── feorm-market.tsx        # Marketplace state
│   │   ├── feorm-bookings.tsx      # Booking state
│   │   └── feorm-onboarding.tsx    # Onboarding state
│   ├── lib/
│   │   ├── avatar.tsx              # Avatar resolution system
│   │   ├── config.ts               # App configuration
│   │   ├── format.ts               # Price formatting
│   │   ├── regions.ts              # Namibian regions
│   │   └── utils.ts                # cn() utility
│   ├── hooks/
│   │   ├── use-listings.ts         # Supabase listing fetch
│   │   └── use-bookings.ts         # Supabase booking fetch
│   └── utils/
│       └── supabase/
│           ├── server.ts           # Server-side client
│           ├── client.ts           # Browser client
│           └── middleware.ts        # Middleware session refresh
├── tailwind.config.ts              # Tailwind + shadcn theme mapping
├── next.config.ts                  # Next.js config (image domains)
├── .env.local                      # Environment variables (gitignored)
└── design.md                       # This file
```

---

*Last updated: 2026-06-03*
*Project version: 0.2.0*
*Deployment target: Vercel (auto-deploy from GitHub main)*

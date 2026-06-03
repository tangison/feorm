# Supabase Agent Skills

## Project Configuration
- **Supabase URL**: https://exftukrcibzrudguukik.supabase.co
- **Anon Key**: sb_publishable_JROSuXnobakfzVq9xeSVog_8tOpTM8g
- **Project ID**: exftukrcibzrudguukik
- **Site URL**: https://feorm-git-main-tangison-s-projects.vercel.app
- **Auth Callback**: /auth/callback

## Database Schema

### Tables
1. **profiles** — extends auth.users
   - `id` UUID PK (FK → auth.users)
   - `name`, `surname` TEXT
   - `phone` TEXT
   - `region` TEXT
   - `role` TEXT CHECK ('voyager', 'provider', 'explorer') DEFAULT 'explorer'
   - `avatar_url` TEXT
   - `trust_score` INTEGER DEFAULT 0
   - `verified` BOOLEAN DEFAULT false
   - `created_at` TIMESTAMPTZ

2. **listings** — farm stays and equipment
   - `id` UUID PK (gen_random_uuid)
   - `host_id` UUID FK → profiles
   - `title` TEXT NOT NULL
   - `description` TEXT
   - `category` TEXT CHECK ('stay', 'equipment')
   - `region` TEXT NOT NULL
   - `price_cents` INTEGER NOT NULL
   - `host_phone` TEXT
   - `images` TEXT[] DEFAULT '{}'
   - `amenities` TEXT[] DEFAULT '{}'
   - `lat` DOUBLE PRECISION
   - `lng` DOUBLE PRECISION
   - `active` BOOLEAN DEFAULT true
   - `created_at` TIMESTAMPTZ

3. **bookings** — reservations
   - `id` UUID PK
   - `listing_id` UUID FK → listings
   - `voyager_id` UUID FK → profiles
   - `check_in` DATE
   - `check_out` DATE
   - `total_cents` INTEGER
   - `escrow_cents` INTEGER
   - `status` TEXT CHECK (pending/confirmed/active/completed/cancelled/disputed)
   - `reference` TEXT UNIQUE
   - `created_at` TIMESTAMPTZ

### RLS Policies
- profiles: users read/update/insert own profile (auth.uid() = id)
- listings: anyone reads active; providers manage own (auth.uid() = host_id)
- bookings: voyagers read own; providers read bookings for own listings

### Trigger
- `handle_new_user()`: auto-creates profile on auth.users insert

## Auth Flow
1. User enters email on /auth page
2. `signInWithOtp()` sends magic link
3. User clicks link → redirected to /auth/callback
4. PKCE code exchanged for session
5. Profile checked: has name → /marketplace, no name → /auth/identity
6. Onboarding: identity → role → provider/voyager paths → terms → marketplace

## Codebase Integration
- **Server client**: `src/utils/supabase/server.ts` (createServerClient with cookies)
- **Browser client**: `src/utils/supabase/client.ts` (createBrowserClient)
- **Middleware**: `src/utils/supabase/middleware.ts` (session refresh)
- **Auth lib**: `src/lib/auth.ts` (requestMagicLink, exchangeCodeForSession, etc.)
- **DB lib**: `src/lib/db.ts` (getListings, createListing, getBookings, etc.)
- **Auth context**: `src/context/feorm-auth.tsx` (FeormAuthProvider + onAuthStateChange)

## Common Operations

### Query listings by category
```sql
SELECT l.*, p.name as host_name, p.phone as host_phone
FROM listings l
JOIN profiles p ON p.id = l.host_id
WHERE l.category = 'stay' AND l.active = true
ORDER BY l.created_at DESC;
```

### Create a booking
```sql
INSERT INTO bookings (listing_id, voyager_id, check_in, check_out, total_cents, escrow_cents, status, reference)
VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)
RETURNING *;
```

### Update user profile
```sql
UPDATE profiles SET name = $2, surname = $3, phone = $4, region = $5, role = $6
WHERE id = $1
RETURNING *;
```

## Namibian Context
- Currency: Namibian Dollars (N$), stored as cents (e.g., N$150 = 15000 cents)
- 14 regions: Khomas, Erongo, Kunene, Otjozondjupa, Oshana, Omusati, Ohangwena, Oshikoto, Kavango East, Kavango West, Zambezi, Omaheke, Hardap, //Karas
- Phone format: +264 8X XXX XXXX
- Escrow deposit: N$1,500 minimum, 10% of total
- Damage cover: N$10,000 communal pool

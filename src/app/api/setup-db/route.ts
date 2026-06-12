import { NextRequest, NextResponse } from "next/server";

/**
 * One-time database setup route.
 * Connects directly to PostgreSQL via DATABASE_URL env var.
 * Creates schema + seeds data in one call.
 *
 * Call: GET /api/setup-db?secret=feorm-seed-2026
 * Requires: DATABASE_URL env var (Supabase pooler connection string)
 */

const SCHEMA_SQL = `
create table if not exists profiles (
  id uuid primary key,
  name text,
  surname text,
  phone text,
  region text,
  role text check (role in ('guest', 'voyager', 'provider_stay', 'admin')) default 'guest',
  avatar_url text,
  trust_score integer default 0,
  verified boolean default false,
  created_at timestamptz default now()
);

create table if not exists listings (
  id uuid default gen_random_uuid() primary key,
  host_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  category text check (category in ('stay')) not null default 'stay',
  region text not null,
  price_cents integer not null,
  host_phone text,
  images text[] default '{}',
  amenities text[] default '{}',
  lat double precision,
  lng double precision,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references listings(id) on delete cascade not null,
  voyager_id uuid references profiles(id) on delete cascade not null,
  check_in date not null,
  check_out date not null,
  total_cents integer not null,
  escrow_cents integer not null,
  status text default 'pending' check (status in ('pending','confirmed','active','completed','cancelled','disputed')),
  reference text unique,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table listings enable row level security;
alter table bookings enable row level security;

DO $$ BEGIN
  create policy "Anyone can read basic profiles" on profiles for select using (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  create policy "Anyone can read active listings" on listings for select using (active = true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  create policy "Providers can read own listings" on listings for select using (auth.uid() = host_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  create policy "Providers can insert own listings" on listings for insert with check (auth.uid() = host_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  create policy "Providers can update own listings" on listings for update using (auth.uid() = host_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  create policy "Providers can delete own listings" on listings for delete using (auth.uid() = host_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  create policy "Voyagers can read own bookings" on bookings for select using (auth.uid() = voyager_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  create policy "Providers can read bookings for own listings" on bookings for select using (listing_id in (select id from listings where host_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  create policy "Voyagers can create bookings" on bookings for insert with check (auth.uid() = voyager_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

create index if not exists idx_listings_category on listings(category);
create index if not exists idx_listings_region on listings(region);
create index if not exists idx_listings_active on listings(active);
create index if not exists idx_listings_host_id on listings(host_id);
create index if not exists idx_bookings_voyager_id on bookings(voyager_id);
create index if not exists idx_bookings_listing_id on bookings(listing_id);
create index if not exists idx_bookings_reference on bookings(reference);
`;

const SEED_PROFILES = [
  ["a0000000-0000-0000-0000-000000000001", "Aisha", "Mwangi", "+264 81 234 5678", "Oshikoto", "provider_stay", true],
  ["a0000000-0000-0000-0000-000000000002", "Johan", "Pretorius", "+264 81 345 6789", "Khomas", "provider_stay", true],
  ["a0000000-0000-0000-0000-000000000005", "Hafeni", "Tshivhuli", "+264 81 567 8902", "Kavango East", "provider_stay", true],
];

const SEED_LISTINGS = [
  ["b0000001-0000-0000-0000-000000000001", "a0000000-0000-0000-0000-000000000002", "Otjiseva Farm Stay", "A peaceful farm stay nestled in the Khomas Hochland with panoramic views of the Auas Mountains.", "stay", "Khomas", 120000, "+264 81 234 5678", "{}", "{Solar power,Borehole water,Braai area,Hot water,Bush view,Stargazing deck,Guided farm walks}", -22.5747, 17.0832, true],
  ["b0000002-0000-0000-0000-000000000001", "a0000000-0000-0000-0000-000000000002", "Swakopmund Agro Stay", "Coastal farm stay just outside Swakopmund where the desert meets the sea.", "stay", "Erongo", 180000, "+264 81 456 7890", "{}", "{WiFi (limited),Self-catering kitchen,Hot water,Camping allowed,Stargazing deck,Guided farm walks,Solar power}", -22.6788, 14.5256, true],
  ["b0000003-0000-0000-0000-000000000001", "a0000000-0000-0000-0000-000000000001", "Epupa Falls Riverside Lodge", "Remote farm stay on the Kunene River with spectacular views of Epupa Falls.", "stay", "Kunene", 220000, "+264 81 678 9012", "{}", "{Hot water,Bush view,Game farm,Guided farm walks,Horse riding,Camping allowed,Stargazing deck}", -17.0063, 13.2454, true],
  ["b0000004-0000-0000-0000-000000000001", "a0000000-0000-0000-0000-000000000002", "Okahandja Guest Farm", "Classic Namibian guest farm set among acacia woodlands near Okahandja.", "stay", "Otjozondjupa", 95000, "+264 81 789 0123", "{}", "{Borehole water,Braai area,Hot water,Swimming pool,Game farm,Camping allowed,Self-catering kitchen}", -21.9823, 16.9187, true],
  ["b0000005-0000-0000-0000-000000000001", "a0000000-0000-0000-0000-000000000001", "Oshakati Mahangu Farm", "Traditional mahangu farm stay in the heart of Owambo country.", "stay", "Oshana", 65000, "+264 81 901 2345", "{}", "{Borehole water,Self-catering kitchen,Guided farm walks,Camping allowed,Hot water}", -17.7833, 15.6833, true],
  ["b0000006-0000-0000-0000-000000000001", "a0000000-0000-0000-0000-000000000001", "Eenhana Homestead Stay", "Authentic Owambo homestead experience near Eenhana.", "stay", "Ohangwena", 45000, "+264 81 123 4567", "{}", "{Borehole water,Guided farm walks,Self-catering kitchen,Camping allowed,Hot water}", -17.5697, 16.3352, true],
  ["b0000007-0000-0000-0000-000000000001", "a0000000-0000-0000-0000-000000000001", "Tsumeb Copper Country Lodge", "Farm stay on the edge of the Etosha pan with game viewing and mining history tours.", "stay", "Oshikoto", 150000, "+264 81 234 5670", "{}", "{Swimming pool,Game farm,Hot water,WiFi (limited),Bush view,Stargazing deck,Guided farm walks}", -19.2433, 17.7308, true],
  ["b0000008-0000-0000-0000-000000000001", "a0000000-0000-0000-0000-000000000005", "Rundu Riverfront Farm", "Lush Kavango riverfront farm stay with tropical gardens and bird-watching paradise.", "stay", "Kavango East", 135000, "+264 81 345 6780", "{}", "{Borehole water,Hot water,Bush view,Horse riding,Swimming pool,Self-catering kitchen,Guided farm walks}", -17.9313, 19.7654, true],
  ["b0000009-0000-0000-0000-000000000001", "a0000000-0000-0000-0000-000000000005", "Nkurenkuru Cattle Post", "Traditional Kavango cattle post stay on the western banks of the Okavango River.", "stay", "Kavango West", 75000, "+264 81 567 8902", "{}", "{Borehole water,Bush view,Camping allowed,Hot water,Guided farm walks,Self-catering kitchen}", -17.9854, 19.1978, true],
  ["b0000010-0000-0000-0000-000000000001", "a0000000-0000-0000-0000-000000000005", "Katima Mulilo Floodplain Stay", "Riverside farm stay in the Zambezi Region where four countries meet.", "stay", "Zambezi", 165000, "+264 81 678 9013", "{}", "{Hot water,Bush view,Game farm,Camping allowed,Horse riding,Guided farm walks,Swimming pool}", -17.4938, 24.2639, true],
  ["b0000011-0000-0000-0000-000000000001", "a0000000-0000-0000-0000-000000000002", "Gobabis Cattle Ranch", "Working cattle ranch in the Omaheke. Authentic cowboy culture meets African wilderness.", "stay", "Omaheke", 110000, "+264 81 890 1235", "{}", "{Borehole water,Braai area,Hot water,Horse riding,Game farm,Guided farm walks,Bush view}", -22.4494, 18.9681, true],
  ["b0000012-0000-0000-0000-000000000001", "a0000000-0000-0000-0000-000000000002", "Mariental Kalahari Retreat", "Kalahari desert farm stay with red dune views and abundant wildlife.", "stay", "Hardap", 98000, "+264 81 012 3457", "{}", "{Solar power,Borehole water,Braai area,Hot water,Game farm,Stargazing deck,Camping allowed}", -24.6333, 17.95, true],
  ["b0000013-0000-0000-0000-000000000001", "a0000000-0000-0000-0000-000000000002", "Keetmanshoop Karas Mountain Lodge", "Dramatic mountain lodge in the //Karas region with ancient quiver tree forests.", "stay", "//Karas", 190000, "+264 81 234 5679", "{}", "{Solar power,Hot water,Bush view,Stargazing deck,WiFi (limited),Game farm,Guided farm walks}", -26.5818, 18.1284, true],
  ["b0000014-0000-0000-0000-000000000001", "a0000000-0000-0000-0000-000000000002", "Khomas Hochland Luxury Camp", "Exclusive glamping experience in the Khomas Hochland mountains.", "stay", "Khomas", 220000, "+264 81 456 7803", "{}", "{Swimming pool,Hot water,WiFi (limited),Stargazing deck,Braai area,Guided farm walks,Bush view}", -22.75, 16.85, true],
  ["b0000015-0000-0000-0000-000000000001", "a0000000-0000-0000-0000-000000000002", "Waterberg Plateau Farmhouse", "Charming farmhouse at the base of the Waterberg Plateau.", "stay", "Otjozondjupa", 175000, "+264 81 789 0126", "{}", "{Hot water,Swimming pool,Game farm,Guided farm walks,Horse riding,Self-catering kitchen,Bush view}", -20.5054, 17.22, true],
  ["b0000016-0000-0000-0000-000000000001", "a0000000-0000-0000-0000-000000000002", "Hardap Dam Fisherman's Cottage", "Cosy cottage on the shores of Hardap Dam. Perfect for fishing enthusiasts.", "stay", "Hardap", 85000, "+264 81 890 1237", "{}", "{Borehole water,Braai area,Hot water,Camping allowed,Self-catering kitchen,Bush view}", -24.5, 17.87, true],
  ["b0000017-0000-0000-0000-000000000001", "a0000000-0000-0000-0000-000000000002", "Karasburg Sheep Station", "Working Karakul sheep station in the deep south of Namibia.", "stay", "//Karas", 70000, "+264 81 901 2348", "{}", "{Solar power,Borehole water,Hot water,Camping allowed,Guided farm walks,Self-catering kitchen}", -28.05, 19.15, true],
];

function validateSecret(request: NextRequest): boolean {
  const url = new URL(request.url);
  return url.searchParams.get("secret") === process.env.SEED_SECRET;
}

export async function GET(request: NextRequest) {
  if (!validateSecret(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({
      error: "DATABASE_URL not set",
      hint: "Add to Vercel env vars: Supabase Dashboard → Settings → Database → Connection string (pooler mode). postgresql://postgres.exftukrcibzrudguukik:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres"
    }, { status: 500 });
  }

  try {
    const pg = await import("pg");
    const client = new pg.Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();
    const results: string[] = [];

    // 1. Create schema
    await client.query(SCHEMA_SQL);
    results.push("Schema created");

    // 2. Seed profiles
    for (const p of SEED_PROFILES) {
      await client.query(
        `INSERT INTO profiles (id, name, surname, phone, region, role, verified) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, surname=EXCLUDED.surname, phone=EXCLUDED.phone, region=EXCLUDED.region, role=EXCLUDED.role, verified=EXCLUDED.verified`,
        p
      );
    }
    results.push(`${SEED_PROFILES.length} profiles seeded`);

    // 3. Seed listings
    for (const l of SEED_LISTINGS) {
      await client.query(
        `INSERT INTO listings (id, host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, category=EXCLUDED.category, region=EXCLUDED.region, price_cents=EXCLUDED.price_cents, host_id=EXCLUDED.host_id, host_phone=EXCLUDED.host_phone, amenities=EXCLUDED.amenities, lat=EXCLUDED.lat, lng=EXCLUDED.lng, active=EXCLUDED.active`,
        l
      );
    }
    results.push(`${SEED_LISTINGS.length} listings seeded`);

    // 4. Verify
    const pc = await client.query("SELECT count(*) as c FROM profiles");
    const lc = await client.query("SELECT count(*) as c FROM listings WHERE active=true AND category='stay'");
    await client.end();

    return NextResponse.json({
      success: true,
      results,
      profileCount: pc.rows[0]?.c,
      listingCount: lc.rows[0]?.c,
    });
  } catch (error) {
    console.error("Setup DB error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Setup failed" }, { status: 500 });
  }
}

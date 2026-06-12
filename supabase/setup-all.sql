-- ============================================================
-- Feorm — Complete Setup Script (Schema + Seed + RLS)
-- Paste this ENTIRE content into Supabase SQL Editor and click Run
-- ============================================================

-- ─── Step 1: Create Tables ──────────────────────────────────

-- Profiles: create WITHOUT FK to auth.users first so we can seed
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
  status text default 'pending' check (
    status in ('pending','confirmed','active',
               'completed','cancelled','disputed')
  ),
  reference text unique,
  created_at timestamptz default now()
);

-- ─── Step 2: Seed Data ──────────────────────────────────────

-- Seed host profiles (placeholder UUIDs — real users will get profiles via trigger)
INSERT INTO profiles (id, name, surname, phone, region, role, verified)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Aisha', 'Mwangi', '+264 81 234 5678', 'Oshikoto', 'provider_stay', true),
  ('a0000000-0000-0000-0000-000000000002', 'Johan', 'Pretorius', '+264 81 345 6789', 'Khomas', 'provider_stay', true),
  ('a0000000-0000-0000-0000-000000000005', 'Hafeni', 'Tshivhuli', '+264 81 567 8902', 'Kavango East', 'provider_stay', true)
ON CONFLICT (id) DO NOTHING;

-- Seed listings (17 farm stays across Namibia)
INSERT INTO listings (host_id, title, description, category, region, price_cents, host_phone, images, amenities, lat, lng, active)
VALUES
  ('a0000000-0000-0000-0000-000000000002', 'Otjiseva Mountain Farm Stay', 'Forty minutes from Windhoek, a world away from the city. Panoramic views of the Auas Mountains from your private stoep, guided walks across the Khomas Hochland, and a traditional braai under the camelthorn trees. Wake up to silence broken only by birdsong and the wind through the grass.', 'stay', 'Khomas', 120000, '+264 81 234 5678', '{}', ARRAY['Solar power', 'Borehole water', 'Braai area', 'Hot water', 'Bush view', 'Stargazing deck', 'Guided farm walks'], -22.5747, 17.0832, true),
  ('a0000000-0000-0000-0000-000000000002', 'Swakop Desert Farm Stay', 'Sleep where the desert meets the Atlantic. Walk from your room into the world oldest desert, watch fog roll in from the ocean, and cook with produce grown using fog-harvesting technology. The Walvis Bay wetlands and flamingo colonies are a 20-minute drive away.', 'stay', 'Erongo', 180000, '+264 81 456 7890', '{}', ARRAY['WiFi (limited)', 'Self-catering kitchen', 'Hot water', 'Camping allowed', 'Stargazing deck', 'Guided farm walks', 'Solar power'], -22.6788, 14.5256, true),
  ('a0000000-0000-0000-0000-000000000001', 'Epupa Falls River Lodge', 'Fall asleep to the sound of the Kunene River cascading over ancient rock. Swim in natural pools above the falls, walk to Himba villages, and eat fresh-caught fish on the riverbank. This is the Namibia that photographs cannot capture — you have to see it for yourself.', 'stay', 'Kunene', 220000, '+264 81 678 9012', '{}', ARRAY['Hot water', 'Bush view', 'Game farm', 'Guided farm walks', 'Horse riding', 'Camping allowed', 'Stargazing deck'], -17.0063, 13.2454, true),
  ('a0000000-0000-0000-0000-000000000002', 'Okahandja Cattle Farm', 'Step into real cattle country. Herds of cattle roam the acacia woodlands while you enjoy hearty farm meals, sundowner drives across the veld, and warm Namibian hospitality. Children and pets are welcome — there is space for everyone to run free.', 'stay', 'Otjozondjupa', 95000, '+264 81 789 0123', '{}', ARRAY['Borehole water', 'Braai area', 'Hot water', 'Swimming pool', 'Game farm', 'Camping allowed', 'Self-catering kitchen'], -21.9823, 16.9187, true),
  ('a0000000-0000-0000-0000-000000000001', 'Oshakati Mahangu Homestead', 'Stay with a family who has farmed this land for generations. Pound mahangu with your host, cook oshifima over an open fire, and sleep in a traditional Owambo homestead. This is not a performance for tourists — this is daily life in northern Namibia, shared with you.', 'stay', 'Oshana', 65000, '+264 81 901 2345', '{}', ARRAY['Borehole water', 'Self-catering kitchen', 'Guided farm walks', 'Camping allowed', 'Hot water'], -17.7833, 15.6833, true),
  ('a0000000-0000-0000-0000-000000000001', 'Eenhana Village Farm Stay', 'Wake up in a traditional Owambo homestead and spend the day herding cattle, pounding mahangu, and sharing stories around the fire. Your host family has lived here for generations and will teach you the rhythms of farm life in Ohangwena. Come as a guest, leave as family.', 'stay', 'Ohangwena', 45000, '+264 81 123 4567', '{}', ARRAY['Borehole water', 'Guided farm walks', 'Self-catering kitchen', 'Camping allowed', 'Hot water'], -17.5697, 16.3352, true),
  ('a0000000-0000-0000-0000-000000000001', 'Tsumeb Etosha Edge Lodge', 'Watch wildlife from your private deck — a waterhole attracts zebra, giraffe, and antelope from the Etosha pan just beyond the fence. After dark, the sky fills with stars undimmed by city lights. The Hoba Meteorite, the largest on Earth, is a short drive away.', 'stay', 'Oshikoto', 150000, '+264 81 234 5670', '{}', ARRAY['Swimming pool', 'Game farm', 'Hot water', 'WiFi (limited)', 'Bush view', 'Stargazing deck', 'Guided farm walks'], -19.2433, 17.7308, true),
  ('a0000000-0000-0000-0000-000000000005', 'Rundu Okavango River Farm', 'Cast a line for tigerfish from the riverbank, paddle through tropical gardens, and fall asleep to the sound of the Okavango. Popa Falls is upstream, birdlife is everywhere, and the farm kitchen serves whatever was caught or picked that day. The greenest farm stay in Namibia.', 'stay', 'Kavango East', 135000, '+264 81 345 6780', '{}', ARRAY['Borehole water', 'Hot water', 'Bush view', 'Horse riding', 'Swimming pool', 'Self-catering kitchen', 'Guided farm walks'], -17.9313, 19.7654, true),
  ('a0000000-0000-0000-0000-000000000005', 'Nkurenkuru River Cattle Post', 'Wake on the western bank of the Okavango and walk with the herd before breakfast. Your host has raised cattle here for decades and will show you how the Kavango people have farmed this river valley for centuries. No frills — just the river, the cattle, and the land.', 'stay', 'Kavango West', 75000, '+264 81 567 8902', '{}', ARRAY['Borehole water', 'Bush view', 'Camping allowed', 'Hot water', 'Guided farm walks', 'Self-catering kitchen'], -17.9854, 19.1978, true),
  ('a0000000-0000-0000-0000-000000000005', 'Katima Zambezi Wetland Stay', 'Paddle a mokoro through wetlands where four countries meet, spot hippos at sunset, and fish the Zambezi for bream and barbel over open water. This is as wild as Namibia gets — crocodiles on the bank, fish eagles overhead, and the Zambezi flowing past your door.', 'stay', 'Zambezi', 165000, '+264 81 678 9013', '{}', ARRAY['Hot water', 'Bush view', 'Game farm', 'Camping allowed', 'Horse riding', 'Guided farm walks', 'Swimming pool'], -17.4938, 24.2639, true),
  ('a0000000-0000-0000-0000-000000000002', 'Gobabis Working Cattle Ranch', 'Ride with the herdsmen across golden grasslands stretching to the Botswana border, then swap stories around the braai fire. This is a working cattle ranch — you will see real ranch life, not a curated show. Hearty meals, warm people, and the Omaheke at its most honest.', 'stay', 'Omaheke', 110000, '+264 81 890 1235', '{}', ARRAY['Borehole water', 'Braai area', 'Hot water', 'Horse riding', 'Game farm', 'Guided farm walks', 'Bush view'], -22.4494, 18.9681, true),
  ('a0000000-0000-0000-0000-000000000002', 'Mariental Kalahari Dune Stay', 'Watch gemsbok and springbok cross red dunes at sunset, spot meerkat colonies at dawn, and braai under a sky so clear the Milky Way casts shadows. This Kalahari farm stay puts you inside the desert, not beside it. The dunes are your backyard.', 'stay', 'Hardap', 98000, '+264 81 012 3457', '{}', ARRAY['Solar power', 'Borehole water', 'Braai area', 'Hot water', 'Game farm', 'Stargazing deck', 'Camping allowed'], -24.6333, 17.9500, true),
  ('a0000000-0000-0000-0000-000000000002', 'Keetmanshoop Quiver Tree Lodge', 'Walk through ancient quiver tree forests, stand on rock formations older than memory, and drive to the Fish River Canyon — the second largest canyon on Earth. After a day of scale and silence, the lodge stargazing deck puts the southern sky at your feet.', 'stay', '//Karas', 190000, '+264 81 234 5679', '{}', ARRAY['Solar power', 'Hot water', 'Bush view', 'Stargazing deck', 'WiFi (limited)', 'Game farm', 'Guided farm walks'], -26.5818, 18.1284, true),
  ('a0000000-0000-0000-0000-000000000002', 'Khomas Hochland Luxury Camp', 'Thirty minutes from Windhoek, but you would never know it. Safari tents with en-suite bathrooms and private decks look out over the mountains. Dinner is farm-to-table under the stars. This is glamping for people who want comfort without losing the bush.', 'stay', 'Khomas', 220000, '+264 81 456 7803', '{}', ARRAY['Swimming pool', 'Hot water', 'WiFi (limited)', 'Stargazing deck', 'Braai area', 'Guided farm walks', 'Bush view'], -22.7500, 16.8500, true),
  ('a0000000-0000-0000-0000-000000000002', 'Waterberg Plateau Farmhouse', 'Climb red sandstone cliffs in the morning, spot sable antelope at the waterhole in the afternoon, and swim in natural rock pools before dinner. The farm kitchen serves potjiekos that people drive hours for. The Waterberg rises right behind the farmhouse.', 'stay', 'Otjozondjupa', 175000, '+264 81 789 0126', '{}', ARRAY['Hot water', 'Swimming pool', 'Game farm', 'Guided farm walks', 'Horse riding', 'Self-catering kitchen', 'Bush view'], -20.5054, 17.2200, true),
  ('a0000000-0000-0000-0000-000000000002', 'Hardap Dam Fishing Cottage', 'Cast for yellowfish and barbel from the bank of Namibia''s largest dam, or take the small boat out at first light. Bird watchers spot over 60 species from the cottage porch. Evenings end with the sun dropping behind the water and a braai on the deck.', 'stay', 'Hardap', 85000, '+264 81 890 1237', '{}', ARRAY['Borehole water', 'Braai area', 'Hot water', 'Camping allowed', 'Self-catering kitchen', 'Bush view'], -24.5000, 17.8700, true),
  ('a0000000-0000-0000-0000-000000000002', 'Karasburg Sheep Station Stay', 'Stay on a working Karakul sheep station where the plains stretch to South Africa. Walk with the shepherd, learn about a farming tradition that shaped the south, and watch the sun set over a landscape so vast it changes how you measure distance. Raw, quiet, and unforgettable.', 'stay', '//Karas', 70000, '+264 81 901 2348', '{}', ARRAY['Solar power', 'Borehole water', 'Hot water', 'Camping allowed', 'Guided farm walks', 'Self-catering kitchen'], -28.0500, 19.1500, true)
ON CONFLICT DO NOTHING;

-- ─── Step 3: Add FK from profiles to auth.users ─────────────
-- Now that seed data is in, add the foreign key
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'profiles_id_fkey' AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey
      FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ─── Step 4: Row Level Security ────────────────────────────
alter table profiles enable row level security;
alter table listings enable row level security;
alter table bookings enable row level security;

-- Profiles policies
DROP POLICY IF EXISTS "Anyone can read basic profiles" ON profiles;
CREATE POLICY "Anyone can read basic profiles" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Listings policies
DROP POLICY IF EXISTS "Anyone can read active listings" ON listings;
CREATE POLICY "Anyone can read active listings" ON listings FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Providers can read own listings" ON listings;
CREATE POLICY "Providers can read own listings" ON listings FOR SELECT USING (auth.uid() = host_id);

DROP POLICY IF EXISTS "Providers can insert own listings" ON listings;
CREATE POLICY "Providers can insert own listings" ON listings FOR INSERT WITH CHECK (auth.uid() = host_id);

DROP POLICY IF EXISTS "Providers can update own listings" ON listings;
CREATE POLICY "Providers can update own listings" ON listings FOR UPDATE USING (auth.uid() = host_id);

DROP POLICY IF EXISTS "Providers can delete own listings" ON listings;
CREATE POLICY "Providers can delete own listings" ON listings FOR DELETE USING (auth.uid() = host_id);

-- Bookings policies
DROP POLICY IF EXISTS "Voyagers can read own bookings" ON bookings;
CREATE POLICY "Voyagers can read own bookings" ON bookings FOR SELECT USING (auth.uid() = voyager_id);

DROP POLICY IF EXISTS "Providers can read bookings for own listings" ON bookings;
CREATE POLICY "Providers can read bookings for own listings" ON bookings FOR SELECT USING (
  listing_id IN (SELECT id FROM listings WHERE host_id = auth.uid())
);

DROP POLICY IF EXISTS "Voyagers can create bookings" ON bookings;
CREATE POLICY "Voyagers can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = voyager_id);

-- Admin RLS policies
DROP POLICY IF EXISTS "Admin full access profiles" ON profiles;
CREATE POLICY "Admin full access profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admin full access listings" ON listings;
CREATE POLICY "Admin full access listings" ON listings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admin full access bookings" ON bookings;
CREATE POLICY "Admin full access bookings" ON bookings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ─── Step 5: Auto-create profile on signup ─────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, verified)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    false
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Step 6: Indexes ──────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_region ON listings(region);
CREATE INDEX IF NOT EXISTS idx_listings_active ON listings(active);
CREATE INDEX IF NOT EXISTS idx_listings_host_id ON listings(host_id);
CREATE INDEX IF NOT EXISTS idx_bookings_voyager_id ON bookings(voyager_id);
CREATE INDEX IF NOT EXISTS idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(reference);

-- ─── Step 7: Prevent double bookings ───────────────────────
CREATE OR REPLACE FUNCTION check_double_booking()
RETURNS trigger AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM bookings
    WHERE listing_id = NEW.listing_id
    AND status NOT IN ('cancelled', 'disputed')
    AND daterange(check_in, check_out, '[)') &&
        daterange(NEW.check_in, NEW.check_out, '[)')
  ) THEN
    RAISE EXCEPTION 'Listing already booked for these dates';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_double_booking ON bookings;
CREATE TRIGGER prevent_double_booking
  BEFORE INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION check_double_booking();

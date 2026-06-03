-- ============================================================
-- Feorm — Supabase Database Schema
-- Run this in the Supabase SQL Editor (one-time setup)
-- ============================================================

-- ─── Profiles (extends Supabase auth.users) ─────────────────
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  surname text,
  phone text,
  region text,
  role text check (role in ('voyager', 'provider', 'explorer')) default 'explorer',
  avatar_url text,
  trust_score integer default 0,
  verified boolean default false,
  created_at timestamptz default now()
);

-- ─── Listings ───────────────────────────────────────────────
create table if not exists listings (
  id uuid default gen_random_uuid() primary key,
  host_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  category text check (category in ('stay', 'equipment')) not null,
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

-- ─── Bookings ──────────────────────────────────────────────
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

-- ─── Row Level Security ───────────────────────────────────
alter table profiles enable row level security;
alter table listings enable row level security;
alter table bookings enable row level security;

-- Profiles: users can read and update own profile
create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Listings: anyone can read active listings, providers manage own
create policy "Anyone can read active listings"
  on listings for select using (active = true);

create policy "Providers can read own listings"
  on listings for select using (auth.uid() = host_id);

create policy "Providers can insert own listings"
  on listings for insert with check (auth.uid() = host_id);

create policy "Providers can update own listings"
  on listings for update using (auth.uid() = host_id);

create policy "Providers can delete own listings"
  on listings for delete using (auth.uid() = host_id);

-- Bookings: voyagers can read own bookings, providers can read bookings for their listings
create policy "Voyagers can read own bookings"
  on bookings for select using (auth.uid() = voyager_id);

create policy "Providers can read bookings for own listings"
  on bookings for select using (
    listing_id in (
      select id from listings where host_id = auth.uid()
    )
  );

create policy "Voyagers can create bookings"
  on bookings for insert with check (auth.uid() = voyager_id);

-- ─── Helper: Auto-create profile on signup ────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name, verified)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    false
  );
  return new;
end;
$$;

-- Trigger: create profile when a new user signs up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Indexes for performance ──────────────────────────────
create index if not exists idx_listings_category on listings(category);
create index if not exists idx_listings_region on listings(region);
create index if not exists idx_listings_active on listings(active);
create index if not exists idx_listings_host_id on listings(host_id);
create index if not exists idx_bookings_voyager_id on bookings(voyager_id);
create index if not exists idx_bookings_listing_id on bookings(listing_id);
create index if not exists idx_bookings_reference on bookings(reference);

/**
 * Feorm Database Layer — Supabase
 *
 * All database operations use Supabase.
 * Tables: profiles, listings, bookings
 *
 * Schema mapping:
 *   DB listings.price_cents → App price (cents)
 *   DB listings.category    → App type + category (category serves both)
 *   DB listings.active      → App available
 *   DB listings.images[]    → App imageUrl (first image)
 *   DB listings.amenities[] → App features (comma-joined)
 *   DB listings.host_id     → App hostId (profiles join for hostName)
 */

import { createClient } from "@/utils/supabase/server";

// ──────────────────────────────────────────────
// Listings
// ──────────────────────────────────────────────

export interface ListingData {
  id: string;
  title: string;
  region: string;
  price: number;
  type: string;
  category: string;
  description: string;
  imageUrl: string;
  features: string;
  hostId: string;
  hostName: string;
  hostPhone: string;
  available: boolean;
  lat?: number | null;
  lng?: number | null;
  createdAt?: string;
}

// Table: listings + profiles join
// Operation: SELECT * WHERE category = $1 AND active = true, JOIN profiles
export async function getListings(type?: string): Promise<ListingData[]> {
  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select("*, profiles(name, phone, avatar_url)")
    .eq("active", true)
    .order("created_at", { ascending: false });

  // Map app type to DB category
  if (type) {
    query = query.eq("category", type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getListings error:", error);
    throw new Error(`Failed to fetch listings: ${error.message}`);
  }

  return (data ?? []).map(mapListingRow);
}

// Table: listings + profiles join
// Operation: SELECT * WHERE id = $1
export async function getListingById(id: string): Promise<ListingData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select("*, profiles(name, phone, avatar_url)")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    console.error("getListingById error:", error);
    throw new Error(`Failed to fetch listing: ${error.message}`);
  }

  return data ? mapListingRow(data) : null;
}

// Table: listings
// Operation: INSERT
export async function createListing(
  data: Omit<ListingData, "id" | "createdAt">
): Promise<ListingData> {
  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from("listings")
    .insert({
      host_id: data.hostId,
      title: data.title,
      description: data.description,
      category: data.category || data.type,
      region: data.region,
      price_cents: data.price,
      host_phone: data.hostPhone,
      images: data.imageUrl ? [data.imageUrl] : [],
      amenities: data.features ? data.features.split(",").map((f: string) => f.trim()) : [],
      lat: data.lat ?? null,
      lng: data.lng ?? null,
      active: data.available,
    })
    .select("*, profiles(name, phone, avatar_url)")
    .single();

  if (error) {
    console.error("createListing error:", error);
    throw new Error(`Failed to create listing: ${error.message}`);
  }

  return mapListingRow(row);
}

// ──────────────────────────────────────────────
// Bookings
// ──────────────────────────────────────────────

export interface BookingData {
  id: string;
  userId: string;
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  escrowAmount: number;
  serviceFee: number;
  status: string;
  referenceNumber: string;
  withOperator: boolean;
  listing?: {
    id: string;
    title: string;
    type: string;
    category: string;
    region: string;
    imageUrl: string;
  };
}

// Table: bookings + listings join
// Operation: SELECT * WHERE voyager_id = $1, JOIN listings
export async function getBookings(userId: string): Promise<BookingData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("*, listing:listings(id, title, category, region, images)")
    .eq("voyager_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getBookings error:", error);
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }

  return (data ?? []).map(mapBookingRow);
}

// Table: bookings + listings join
// Operation: SELECT * WHERE reference = $1
export async function getBookingByReference(
  reference: string
): Promise<BookingData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("*, listing:listings(id, title, category, region, images)")
    .eq("reference", reference)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    console.error("getBookingByReference error:", error);
    throw new Error(`Failed to fetch booking: ${error.message}`);
  }

  return data ? mapBookingRow(data) : null;
}

// Table: bookings
// Operation: INSERT, then SELECT with JOIN listings
export async function createBooking(data: {
  userId: string;
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  serviceFee: number;
  withOperator?: boolean;
}): Promise<BookingData> {
  const supabase = await createClient();

  // Generate a reference number: FEA-XXXXXX
  const reference = `FEA-${Date.now().toString(36).toUpperCase()}`;

  // Calculate escrow: 10% of total, minimum N$500 (50000 cents)
  const escrowAmount = Math.max(50000, Math.round(data.totalPrice * 0.1));

  const { data: row, error } = await supabase
    .from("bookings")
    .insert({
      voyager_id: data.userId,
      listing_id: data.listingId,
      check_in: data.startDate,
      check_out: data.endDate,
      total_cents: data.totalPrice,
      escrow_cents: escrowAmount,
      status: "pending",
      reference,
    })
    .select("*, listing:listings(id, title, category, region, images)")
    .single();

  if (error) {
    console.error("createBooking error:", error);
    throw new Error(`Failed to create booking: ${error.message}`);
  }

  return mapBookingRow(row);
}

// ──────────────────────────────────────────────
// Auth / Profiles
// ──────────────────────────────────────────────

export interface UserData {
  id: string;
  email?: string;
  phone?: string | null;
  name?: string | null;
  surname?: string | null;
  region?: string | null;
  role: string;
  verified: boolean;
  avatarUrl?: string | null;
}

// Table: profiles
// Operation: SELECT * WHERE id = $1 (auth.uid), or INSERT if not exists
export async function findOrCreateUserById(
  authUserId: string,
  email?: string
): Promise<UserData> {
  const supabase = await createClient();

  // Try to find existing profile
  const { data: existing, error: selectError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUserId)
    .maybeSingle();

  if (selectError) {
    console.error("findOrCreateUserById select error:", selectError);
    throw new Error(`Failed to lookup user: ${selectError.message}`);
  }

  if (existing) {
    return mapProfileRow(existing);
  }

  // Create new profile (trigger should also do this, but as fallback)
  const { data: created, error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: authUserId,
      name: email ? email.split("@")[0] : null,
      role: "guest",
      verified: false,
    })
    .select()
    .single();

  if (insertError) {
    console.error("findOrCreateUserById insert error:", insertError);
    throw new Error(`Failed to create user: ${insertError.message}`);
  }

  return mapProfileRow(created);
}

// Table: profiles
// Operation: SELECT * WHERE phone = $1, or INSERT if not exists
// (Legacy — kept for backward compatibility)
export async function findOrCreateUser(phone: string): Promise<UserData> {
  const supabase = await createClient();

  // Try to find existing profile by phone
  const { data: existing, error: selectError } = await supabase
    .from("profiles")
    .select("*")
    .eq("phone", phone)
    .maybeSingle();

  if (selectError) {
    console.error("findOrCreateUser select error:", selectError);
    throw new Error(`Failed to lookup user: ${selectError.message}`);
  }

  if (existing) {
    return mapProfileRow(existing);
  }

  // Create new profile
  const { data: created, error: insertError } = await supabase
    .from("profiles")
    .insert({
      phone,
      role: "guest",
      verified: false,
    })
    .select()
    .single();

  if (insertError) {
    console.error("findOrCreateUser insert error:", insertError);
    throw new Error(`Failed to create user: ${insertError.message}`);
  }

  return mapProfileRow(created);
}

// Table: profiles
// Operation: UPDATE SET ... WHERE id = $1
export async function updateUserById(
  userId: string,
  data: {
    name?: string;
    surname?: string;
    phone?: string;
    region?: string;
    role?: string;
    avatarUrl?: string;
  }
): Promise<UserData> {
  const supabase = await createClient();

  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.surname !== undefined) updateData.surname = data.surname;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.region !== undefined) updateData.region = data.region;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;

  const { data: row, error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("updateUserById error:", error);
    throw new Error(`Failed to update user: ${error.message}`);
  }

  return mapProfileRow(row);
}

// Table: profiles
// Operation: UPDATE SET ... WHERE phone = $1
// (Legacy — kept for backward compatibility)
export async function updateUser(
  phone: string,
  data: {
    name?: string;
    surname?: string;
    region?: string;
    role?: string;
    avatarUrl?: string;
  }
): Promise<UserData> {
  const supabase = await createClient();

  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.surname !== undefined) updateData.surname = data.surname;
  if (data.region !== undefined) updateData.region = data.region;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;

  const { data: row, error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("phone", phone)
    .select()
    .single();

  if (error) {
    console.error("updateUser error:", error);
    throw new Error(`Failed to update user: ${error.message}`);
  }

  return mapProfileRow(row);
}

// ──────────────────────────────────────────────
// Row Mappers (snake_case DB → camelCase app)
// ──────────────────────────────────────────────

function mapListingRow(row: Record<string, unknown>): ListingData {
  const profile = row.profiles as Record<string, unknown> | null;
  const images = row.images as string[] | null;
  const amenities = row.amenities as string[] | null;

  return {
    id: row.id as string,
    title: row.title as string,
    region: row.region as string,
    price: (row.price_cents ?? row.price) as number,
    type: (row.category ?? row.type) as string,
    category: (row.category ?? row.type) as string,
    description: (row.description ?? "") as string,
    imageUrl: images?.[0] ?? (row.image_url ?? row.imageUrl ?? "") as string,
    features: amenities ? amenities.join(",") : (row.features ?? "") as string,
    hostId: (row.host_id ?? row.hostId) as string,
    hostName: (profile?.name ?? row.host_name ?? row.hostName ?? "") as string,
    hostPhone: (profile?.phone ?? row.host_phone ?? row.hostPhone ?? "") as string,
    available: (row.active ?? row.available) as boolean,
    lat: (row.lat ?? null) as number | null,
    lng: (row.lng ?? null) as number | null,
    createdAt: (row.created_at ?? row.createdAt) as string | undefined,
  };
}

function mapBookingRow(row: Record<string, unknown>): BookingData {
  const listing = row.listing as Record<string, unknown> | null;
  const listingImages = listing?.images as string[] | null;

  return {
    id: row.id as string,
    userId: (row.voyager_id ?? row.user_id ?? row.userId) as string,
    listingId: (row.listing_id ?? row.listingId) as string,
    startDate: (row.check_in ?? row.start_date ?? row.startDate) as string,
    endDate: (row.check_out ?? row.end_date ?? row.endDate) as string,
    totalPrice: (row.total_cents ?? row.total_price ?? row.totalPrice) as number,
    escrowAmount: (row.escrow_cents ?? row.escrow_amount ?? row.escrowAmount) as number,
    serviceFee: (row.service_fee ?? row.serviceFee ?? 0) as number,
    status: row.status as string,
    referenceNumber: (row.reference ?? row.reference_number ?? row.referenceNumber) as string,
    withOperator: (row.with_operator ?? row.withOperator ?? false) as boolean,
    listing: listing
      ? {
          id: listing.id as string,
          title: listing.title as string,
          type: (listing.category ?? listing.type ?? "") as string,
          category: (listing.category ?? listing.type ?? "") as string,
          region: listing.region as string,
          imageUrl: listingImages?.[0] ?? (listing.image_url ?? listing.imageUrl ?? "") as string,
        }
      : undefined,
  };
}

function mapProfileRow(row: Record<string, unknown>): UserData {
  return {
    id: row.id as string,
    email: row.email as string | undefined,
    phone: row.phone as string | null,
    name: row.name as string | null,
    surname: row.surname as string | null,
    region: row.region as string | null,
    role: row.role as string,
    verified: row.verified as boolean,
    avatarUrl: (row.avatar_url ?? row.avatarUrl) as string | null,
  };
}

/**
 * Feorm Database Layer — Supabase
 *
 * All database operations now use Supabase.
 * Tables: listings, bookings, profiles
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
  createdAt?: string;
}

// Table: listings
// Operation: SELECT * WHERE type = $1 AND available = true ORDER BY created_at DESC
export async function getListings(type?: string): Promise<ListingData[]> {
  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select("*")
    .eq("available", true)
    .order("created_at", { ascending: false });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getListings error:", error);
    throw new Error(`Failed to fetch listings: ${error.message}`);
  }

  return (data ?? []).map(mapListingRow);
}

// Table: listings
// Operation: SELECT * WHERE id = $1
export async function getListingById(id: string): Promise<ListingData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select("*")
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
      title: data.title,
      region: data.region,
      price: data.price,
      type: data.type,
      category: data.category,
      description: data.description,
      image_url: data.imageUrl,
      features: data.features,
      host_id: data.hostId,
      host_name: data.hostName,
      host_phone: data.hostPhone,
      available: data.available,
    })
    .select()
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

// Table: bookings
// Operation: SELECT * WHERE user_id = $1, JOIN listings
export async function getBookings(userId: string): Promise<BookingData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("*, listing:listings(id, title, type, category, region, image_url)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getBookings error:", error);
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }

  return (data ?? []).map(mapBookingRow);
}

// Table: bookings
// Operation: SELECT * WHERE reference_number = $1
export async function getBookingByReference(
  reference: string
): Promise<BookingData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("*, listing:listings(id, title, type, category, region, image_url)")
    .eq("reference_number", reference)
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
  const refNum = `FEA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // Calculate escrow: 10% of total, minimum N$500
  const escrowAmount = Math.max(50000, Math.round(data.totalPrice * 0.1));

  const { data: row, error } = await supabase
    .from("bookings")
    .insert({
      user_id: data.userId,
      listing_id: data.listingId,
      start_date: data.startDate,
      end_date: data.endDate,
      total_price: data.totalPrice,
      escrow_amount: escrowAmount,
      service_fee: data.serviceFee,
      status: "pending",
      reference_number: refNum,
      with_operator: data.withOperator ?? false,
    })
    .select("*, listing:listings(id, title, type, category, region, image_url)")
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
  phone: string;
  name?: string | null;
  surname?: string | null;
  region?: string | null;
  role: string;
  verified: boolean;
  avatarUrl?: string | null;
}

// Table: profiles
// Operation: SELECT * WHERE phone = $1, or INSERT if not exists
export async function findOrCreateUser(phone: string): Promise<UserData> {
  const supabase = await createClient();

  // Try to find existing profile
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
      role: "explorer",
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
// Operation: UPDATE SET ... WHERE phone = $1
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
  return {
    id: row.id as string,
    title: row.title as string,
    region: row.region as string,
    price: row.price as number,
    type: row.type as string,
    category: row.category as string,
    description: row.description as string,
    imageUrl: (row.image_url ?? row.imageUrl) as string,
    features: row.features as string,
    hostId: (row.host_id ?? row.hostId) as string,
    hostName: (row.host_name ?? row.hostName) as string,
    hostPhone: (row.host_phone ?? row.hostPhone) as string,
    available: row.available as boolean,
    createdAt: (row.created_at ?? row.createdAt) as string | undefined,
  };
}

function mapBookingRow(row: Record<string, unknown>): BookingData {
  const listing = row.listing as Record<string, unknown> | null;
  return {
    id: row.id as string,
    userId: (row.user_id ?? row.userId) as string,
    listingId: (row.listing_id ?? row.listingId) as string,
    startDate: (row.start_date ?? row.startDate) as string,
    endDate: (row.end_date ?? row.endDate) as string,
    totalPrice: (row.total_price ?? row.totalPrice) as number,
    escrowAmount: (row.escrow_amount ?? row.escrowAmount) as number,
    serviceFee: (row.service_fee ?? row.serviceFee) as number,
    status: row.status as string,
    referenceNumber: (row.reference_number ?? row.referenceNumber) as string,
    withOperator: (row.with_operator ?? row.withOperator) as boolean,
    listing: listing
      ? {
          id: listing.id as string,
          title: listing.title as string,
          type: listing.type as string,
          category: listing.category as string,
          region: listing.region as string,
          imageUrl: (listing.image_url ?? listing.imageUrl) as string,
        }
      : undefined,
  };
}

function mapProfileRow(row: Record<string, unknown>): UserData {
  return {
    id: row.id as string,
    phone: row.phone as string,
    name: row.name as string | null,
    surname: row.surname as string | null,
    region: row.region as string | null,
    role: row.role as string,
    verified: row.verified as boolean,
    avatarUrl: (row.avatar_url ?? row.avatarUrl) as string | null,
  };
}

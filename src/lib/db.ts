/**
 * Feorm Database Layer — Demo Mode
 *
 * All database operations now use hardcoded demo data
 * instead of Supabase queries.
 */

import {
  DEMO_LISTINGS,
  DEMO_PROFILES,
  DEMO_BOOKINGS,
  getListingById as getDemoListingById,
  getListingsByType as getDemoListingsByType,
  getBookingsByUserId as getDemoBookingsByUserId,
  getBookingByReference as getDemoBookingByReference,
  getProfileById as getDemoProfileById,
  type DemoListing,
  type DemoBooking,
  type DemoProfile,
} from "@/lib/demo-data";

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

export async function getListings(type?: string): Promise<ListingData[]> {
  return getDemoListingsByType(type);
}

export async function getListingById(id: string): Promise<ListingData | null> {
  return getDemoListingById(id) ?? null;
}

export async function createListing(
  data: Omit<ListingData, "id" | "createdAt">
): Promise<ListingData> {
  const newListing: ListingData = {
    ...data,
    id: `b${Date.now().toString(36).padStart(8, "0")}-0000-0000-0000-000000000001`,
    createdAt: new Date().toISOString(),
  };
  return newListing;
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
  listing?: {
    id: string;
    title: string;
    type: string;
    category: string;
    region: string;
    imageUrl: string;
  };
}

export async function getBookings(userId: string): Promise<BookingData[]> {
  return getDemoBookingsByUserId(userId);
}

export async function getBookingByReference(
  reference: string
): Promise<BookingData | null> {
  return getDemoBookingByReference(reference) ?? null;
}

export async function createBooking(data: {
  userId: string;
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  serviceFee: number;
}): Promise<BookingData> {
  const reference = `FEA-${Date.now().toString(36).toUpperCase()}`;
  const escrowAmount = Math.max(50000, Math.round(data.totalPrice * 0.1));

  const listing = getDemoListingById(data.listingId);

  return {
    id: `c${Date.now().toString(36).padStart(8, "0")}-0000-0000-0000-000000000001`,
    userId: data.userId,
    listingId: data.listingId,
    startDate: data.startDate,
    endDate: data.endDate,
    totalPrice: data.totalPrice,
    escrowAmount,
    serviceFee: data.serviceFee,
    status: "pending",
    referenceNumber: reference,
    listing: listing
      ? {
          id: listing.id,
          title: listing.title,
          type: listing.type,
          category: listing.category,
          region: listing.region,
          imageUrl: listing.imageUrl,
        }
      : undefined,
  };
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

export async function findOrCreateUserById(
  authUserId: string,
  email?: string
): Promise<UserData> {
  const profile = getDemoProfileById(authUserId);
  if (profile) {
    return mapProfile(profile);
  }
  // Return a default demo user
  return mapProfile(DEMO_PROFILES.find((p) => p.role === "voyager")!);
}

export async function findOrCreateUser(phone: string): Promise<UserData> {
  const profile = DEMO_PROFILES.find((p) => p.phone === phone);
  if (profile) {
    return mapProfile(profile);
  }
  return mapProfile(DEMO_PROFILES.find((p) => p.role === "voyager")!);
}

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
  const profile = getDemoProfileById(userId);
  if (profile) {
    return {
      ...mapProfile(profile),
      name: data.name ?? profile.name,
      surname: data.surname ?? profile.surname,
      phone: data.phone ?? profile.phone,
      region: data.region ?? profile.region,
      role: data.role ?? profile.role,
      avatarUrl: data.avatarUrl ?? profile.avatarUrl,
    };
  }
  return {
    id: userId,
    name: data.name ?? null,
    surname: data.surname ?? null,
    phone: data.phone ?? null,
    region: data.region ?? null,
    role: data.role ?? "guest",
    verified: false,
    avatarUrl: data.avatarUrl ?? null,
  };
}

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
  const profile = DEMO_PROFILES.find((p) => p.phone === phone);
  if (profile) {
    return {
      ...mapProfile(profile),
      name: data.name ?? profile.name,
      surname: data.surname ?? profile.surname,
      region: data.region ?? profile.region,
      role: data.role ?? profile.role,
      avatarUrl: data.avatarUrl ?? profile.avatarUrl,
    };
  }
  return {
    id: "unknown",
    name: data.name ?? null,
    surname: data.surname ?? null,
    phone,
    region: data.region ?? null,
    role: data.role ?? "guest",
    verified: false,
    avatarUrl: data.avatarUrl ?? null,
  };
}

// ──────────────────────────────────────────────
// Mapper
// ──────────────────────────────────────────────

function mapProfile(profile: DemoProfile): UserData {
  return {
    id: profile.id,
    email: profile.email,
    phone: profile.phone ?? null,
    name: profile.name ?? null,
    surname: profile.surname ?? null,
    region: profile.region ?? null,
    role: profile.role,
    verified: profile.verified,
    avatarUrl: profile.avatarUrl ?? null,
  };
}

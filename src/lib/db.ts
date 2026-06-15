/**
 * Feorm Database Layer — Demo Mode
 *
 * All data comes from hardcoded demo data. No external database.
 * This file provides the same interface as the Supabase version
 * but returns data from demo-data.ts.
 */

import {
  DEMO_LISTINGS,
  DEMO_BOOKINGS,
  DEMO_FARMER,
  DEMO_GUEST,
  type DemoListing,
  type DemoBooking,
  type DemoUser,
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

function mapListing(listing: DemoListing): ListingData {
  return {
    id: listing.id,
    title: listing.title,
    region: listing.region,
    price: listing.price,
    type: listing.type,
    category: listing.category,
    description: listing.description,
    imageUrl: listing.images[0] ?? "",
    features: listing.features.join(","),
    hostId: listing.hostId,
    hostName: listing.hostName,
    hostPhone: listing.hostPhone,
    available: listing.available,
    lat: listing.lat,
    lng: listing.lng,
  };
}

export async function getListings(type?: string): Promise<ListingData[]> {
  let listings = DEMO_LISTINGS;
  if (type) {
    listings = listings.filter((l) => l.category === type || l.type === type);
  }
  return listings.filter((l) => l.available).map(mapListing);
}

export async function getListingById(id: string): Promise<ListingData | null> {
  const listing = DEMO_LISTINGS.find((l) => l.id === id);
  return listing ? mapListing(listing) : null;
}

export async function createListing(
  data: Omit<ListingData, "id" | "createdAt">
): Promise<ListingData> {
  // Demo mode — return a mock listing
  return {
    id: `listing-${Date.now()}`,
    title: data.title,
    region: data.region,
    price: data.price,
    type: data.type,
    category: data.category,
    description: data.description,
    imageUrl: data.imageUrl,
    features: data.features,
    hostId: data.hostId,
    hostName: data.hostName,
    hostPhone: data.hostPhone,
    available: data.available,
    lat: data.lat,
    lng: data.lng,
  };
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

function mapBooking(booking: DemoBooking): BookingData {
  const listing = DEMO_LISTINGS.find((l) => l.id === booking.listingId);
  return {
    id: booking.id,
    userId: "demo-guest-001",
    listingId: booking.listingId,
    startDate: booking.startDate,
    endDate: booking.endDate,
    totalPrice: booking.totalCents,
    escrowAmount: Math.max(50000, Math.round(booking.totalCents * 0.1)),
    serviceFee: Math.round(booking.totalCents * 0.05),
    status: booking.status,
    referenceNumber: booking.reference,
    listing: listing
      ? {
          id: listing.id,
          title: listing.title,
          type: listing.type,
          category: listing.category,
          region: listing.region,
          imageUrl: listing.images[0] ?? "",
        }
      : undefined,
  };
}

export async function getBookings(userId: string): Promise<BookingData[]> {
  // Demo mode — return all demo bookings (userId is ignored)
  return DEMO_BOOKINGS.map(mapBooking);
}

export async function getBookingByReference(
  reference: string
): Promise<BookingData | null> {
  const booking = DEMO_BOOKINGS.find((b) => b.reference === reference);
  return booking ? mapBooking(booking) : null;
}

export async function createBooking(data: {
  userId: string;
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  serviceFee: number;
}): Promise<BookingData> {
  // Demo mode — return a mock booking
  const reference = `FEA-${Date.now().toString(36).toUpperCase()}`;
  const escrowAmount = Math.max(50000, Math.round(data.totalPrice * 0.1));
  const listing = DEMO_LISTINGS.find((l) => l.id === data.listingId);

  return {
    id: `booking-${Date.now()}`,
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
          imageUrl: listing.images[0] ?? "",
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

function mapUser(user: DemoUser): UserData {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    name: user.name,
    surname: user.surname,
    region: user.region,
    role: user.role,
    verified: user.verified,
    avatarUrl: user.avatarUrl,
  };
}

export async function findOrCreateUserById(
  authUserId: string,
  email?: string
): Promise<UserData> {
  // Demo mode — return farmer or guest based on ID
  if (authUserId === DEMO_FARMER.id) return mapUser(DEMO_FARMER);
  if (authUserId === DEMO_GUEST.id) return mapUser(DEMO_GUEST);
  // Fallback — return guest for unknown IDs
  return mapUser(DEMO_GUEST);
}

export async function findOrCreateUser(phone: string): Promise<UserData> {
  // Demo mode — return guest for any phone lookup
  return mapUser(DEMO_GUEST);
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
  // Demo mode — return updated copy of the user
  const base =
    userId === DEMO_FARMER.id ? DEMO_FARMER : DEMO_GUEST;
  return {
    ...mapUser(base),
    ...Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    ),
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
  // Demo mode — return updated copy of guest
  return {
    ...mapUser(DEMO_GUEST),
    ...Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    ),
  };
}

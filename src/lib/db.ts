/**
 * Feorm Database Layer — Vercel-compatible with graceful fallback
 *
 * On Vercel, the filesystem is ephemeral — SQLite won't persist between
 * serverless function invocations. This module wraps all Prisma calls
 * in try/catch and falls back to demo data when the DB is unavailable.
 *
 * For production, swap the Prisma provider to PostgreSQL (Vercel Postgres,
 * Neon, or Supabase) by updating DATABASE_URL and the Prisma schema provider.
 */

import { PrismaClient } from "@prisma/client";
import { DEMO_STAYS, DEMO_EQUIPMENT, ALL_DEMO } from "@/data/demo-listings";
import { DEMO_BOOKINGS } from "@/data/demo-bookings";

// Singleton Prisma client (prevents hot-reload connection leaks in dev)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let _prisma: PrismaClient | null = null;

function getPrisma(): PrismaClient | null {
  try {
    if (!_prisma) {
      _prisma =
        globalForPrisma.prisma ??
        new PrismaClient({
          log: process.env.NODE_ENV === "development" ? ["query"] : [],
        });
      if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = _prisma;
    }
    return _prisma;
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────
// Check if database is available
// ──────────────────────────────────────────────

let _dbAvailable: boolean | null = null;

async function isDbAvailable(): Promise<boolean> {
  if (_dbAvailable !== null) return _dbAvailable;
  try {
    const prisma = getPrisma();
    if (!prisma) { _dbAvailable = false; return false; }
    await prisma.$queryRaw`SELECT 1`;
    _dbAvailable = true;
    return true;
  } catch {
    _dbAvailable = false;
    return false;
  }
}

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

export async function getListings(type?: string): Promise<ListingData[]> {
  try {
    const prisma = getPrisma();
    if (prisma && (await isDbAvailable())) {
      const listings = await prisma.listing.findMany({
        where: {
          ...(type ? { type } : {}),
          available: true,
        },
        orderBy: { createdAt: "desc" },
      });
      if (listings.length > 0) return listings.map(l => ({
        ...l,
        createdAt: l.createdAt?.toISOString(),
      })) as ListingData[];
    }
  } catch {
    // Fall through to demo data
  }

  // Demo fallback
  const source = type === "stay" ? DEMO_STAYS : type === "equipment" ? DEMO_EQUIPMENT : ALL_DEMO;
  return source.map((item) => ({
    id: item._id,
    title: item.title,
    region: item.region,
    price: item.price,
    type: item.type,
    category: item.category,
    description: item.description,
    imageUrl: item.image,
    features: Array.isArray(item.features) ? item.features.join(",") : item.features,
    hostId: "demo",
    hostName: item.hostName,
    hostPhone: item.hostPhone,
    available: true,
  }));
}

export async function getListingById(id: string): Promise<ListingData | null> {
  try {
    const prisma = getPrisma();
    if (prisma && (await isDbAvailable())) {
      const listing = await prisma.listing.findUnique({ where: { id } });
      if (listing) return { ...listing, createdAt: listing.createdAt?.toISOString() } as ListingData;
    }
  } catch {
    // Fall through to demo data
  }

  // Demo fallback
  const demo = ALL_DEMO.find((item) => item._id === id);
  if (!demo) return null;
  return {
    id: demo._id,
    title: demo.title,
    region: demo.region,
    price: demo.price,
    type: demo.type,
    category: demo.category,
    description: demo.description,
    imageUrl: demo.image,
    features: Array.isArray(demo.features) ? demo.features.join(",") : demo.features,
    hostId: "demo",
    hostName: demo.hostName,
    hostPhone: demo.hostPhone,
    available: true,
  };
}

export async function createListing(data: Omit<ListingData, "id" | "createdAt">): Promise<ListingData> {
  try {
    const prisma = getPrisma();
    if (prisma && (await isDbAvailable())) {
      const listing = await prisma.listing.create({ data });
      return { ...listing, createdAt: listing.createdAt?.toISOString() } as ListingData;
    }
  } catch {
    // Fall through to mock
  }
  // Return mock created listing
  return {
    id: `listing-${Date.now()}`,
    ...data,
  } as ListingData;
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
  listing?: { id: string; title: string; type: string; category: string; region: string; imageUrl: string };
}

export async function getBookings(userId: string): Promise<BookingData[]> {
  try {
    const prisma = getPrisma();
    if (prisma && (await isDbAvailable())) {
      const bookings = await prisma.booking.findMany({
        where: { userId },
        include: { listing: true },
        orderBy: { createdAt: "desc" },
      });
      if (bookings.length > 0) return bookings;
    }
  } catch {
    // Fall through to demo data
  }
  return DEMO_BOOKINGS.map((b) => ({
    id: b._id,
    userId: b.userId,
    listingId: b.listingId,
    startDate: b.startDate,
    endDate: b.endDate,
    totalPrice: b.totalPrice,
    escrowAmount: b.escrowAmount,
    serviceFee: b.serviceFee,
    status: b.status,
    referenceNumber: b.reference,
    withOperator: b.withOperator,
    listing: b.listing,
  })) as BookingData[];
}

export async function createBooking(data: {
  userId: string;
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  serviceFee: number;
  withOperator?: boolean;
}): Promise<BookingData> {
  const ref = `FE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  try {
    const prisma = getPrisma();
    if (prisma && (await isDbAvailable())) {
      return (await prisma.booking.create({
        data: {
          ...data,
          escrowAmount: 150000,
          referenceNumber: ref,
          status: "pending",
        },
        include: { listing: true },
      })) as BookingData;
    }
  } catch {
    // Fall through to mock
  }

  return {
    id: `booking-${Date.now()}`,
    ...data,
    escrowAmount: 150000,
    status: "pending",
    referenceNumber: ref,
    withOperator: data.withOperator ?? false,
  } as BookingData;
}

// ──────────────────────────────────────────────
// Auth
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

const DEMO_OTP = "123456";
const inMemoryUsers = new Map<string, UserData>();

export async function findOrCreateUser(phone: string): Promise<UserData> {
  try {
    const prisma = getPrisma();
    if (prisma && (await isDbAvailable())) {
      let user = await prisma.user.findUnique({ where: { phone } });
      if (!user) {
        user = await prisma.user.create({ data: { phone } });
      }
      return user;
    }
  } catch {
    // Fall through to in-memory
  }

  // In-memory fallback
  const existing = inMemoryUsers.get(phone);
  if (existing) return existing;

  const user: UserData = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    phone,
    role: "explorer",
    verified: false,
  };
  inMemoryUsers.set(phone, user);
  return user;
}

export async function updateUser(phone: string, data: { name?: string; surname?: string; region?: string; role?: string; avatarUrl?: string }): Promise<UserData> {
  try {
    const prisma = getPrisma();
    if (prisma && (await isDbAvailable())) {
      return await prisma.user.update({ where: { phone }, data });
    }
  } catch {
    // Fall through to in-memory
  }

  const existing = inMemoryUsers.get(phone);
  const updated = { ...existing, ...data } as UserData;
  inMemoryUsers.set(phone, updated);
  return updated;
}

export function verifyOtp(otp: string): boolean {
  return otp === DEMO_OTP;
}

// ──────────────────────────────────────────────
// Seed (only works with a real database)
// ──────────────────────────────────────────────

export async function seedDatabase(): Promise<{ users: number; listings: number }> {
  const prisma = getPrisma();
  if (!prisma || !(await isDbAvailable())) {
    throw new Error("Database not available — cannot seed. On Vercel, use a persistent database.");
  }

  const existing = await prisma.listing.count();
  if (existing > 0) {
    return { users: 0, listings: existing };
  }

  // The full seed logic is in /api/seed/route.ts — this is a shortcut
  return { users: 0, listings: 0 };
}

"use client";

import { useState, useEffect } from "react";

// ─── Request Deduplication Cache ────────────────────────────────
const bookingCache = new Map<string, { data: BookingData[]; timestamp: number }>();
const CACHE_TTL = 30_000; // 30 seconds

interface ListingSummary {
  id: string;
  title: string;
  type: string;
  category: string;
  region: string;
  imageUrl: string;
}

interface BookingData {
  _id: string;
  listingId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  escrowAmount: number;
  serviceFee: number;
  status: string;
  reference: string;
  listing?: ListingSummary;
}

// Hook for user's bookings — REST API only, no demo fallback
export function useBookings(userId: string) {
  const [data, setData] = useState<BookingData[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      const id = requestAnimationFrame(() => {
        setData([]);
        setIsLoading(false);
      });
      return () => cancelAnimationFrame(id);
    }

    const controller = new AbortController();

    async function fetchBookings() {
      setIsLoading(true);
      setError(null);

      // Check cache first
      const cacheKey = `bookings-${userId}`;
      const cached = bookingCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setData(cached.data);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/bookings?userId=${encodeURIComponent(userId)}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const raw = await res.json();
          const mapped: BookingData[] = Array.isArray(raw)
            ? raw.map((b: Record<string, unknown>) => ({
                _id: b.id as string,
                listingId: b.listingId as string,
                userId: b.userId as string,
                startDate: b.startDate as string,
                endDate: b.endDate as string,
                totalPrice: b.totalPrice as number,
                escrowAmount: b.escrowAmount as number,
                serviceFee: b.serviceFee as number,
                status: b.status as string,
                reference: b.referenceNumber as string,
                listing: b.listing as ListingSummary | undefined,
              }))
            : [];
          bookingCache.set(cacheKey, { data: mapped, timestamp: Date.now() });
          setData(mapped);
          setIsLoading(false);
          return;
        }
        throw new Error(`Failed to fetch bookings: ${res.status}`);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load bookings");
      }
      setIsLoading(false);
    }

    fetchBookings();

    return () => {
      controller.abort();
    };
  }, [userId]);

  return { data, isLoading, error };
}

interface BookingReferenceData {
  _id: string;
  reference: string;
  status: string;
  totalPrice: number;
  listing?: ListingSummary;
}

// Hook for booking by reference — REST API only
export function useBookingByReference(reference: string) {
  const [data, setData] = useState<BookingReferenceData | null>(null);
  const [isLoading, setIsLoading] = useState(!!reference);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) {
      const id = requestAnimationFrame(() => {
        setData(null);
        setIsLoading(false);
      });
      return () => cancelAnimationFrame(id);
    }

    const controller = new AbortController();

    async function fetchBooking() {
      try {
        const res = await fetch(
          `/api/bookings?reference=${encodeURIComponent(reference)}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const raw = await res.json();
          if (raw && !raw.error) {
            setData({
              _id: raw.id as string,
              reference: raw.referenceNumber as string,
              status: raw.status as string,
              totalPrice: raw.totalPrice as number,
              listing: raw.listing as ListingSummary | undefined,
            });
            setIsLoading(false);
            return;
          }
        }
        throw new Error(`Booking not found: ${reference}`);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load booking");
      }
      setIsLoading(false);
    }

    fetchBooking();

    return () => {
      controller.abort();
    };
  }, [reference]);

  return { data, isLoading, error };
}



"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Request Deduplication Cache ────────────────────────────────
const bookingCache = new Map<string, { data: any[]; timestamp: number }>();
const CACHE_TTL = 30_000; // 30 seconds

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
  listing?: any;
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
          const mapped = Array.isArray(raw)
            ? raw.map((b: any) => ({
                _id: b.id,
                listingId: b.listingId,
                userId: b.userId,
                startDate: b.startDate,
                endDate: b.endDate,
                totalPrice: b.totalPrice,
                escrowAmount: b.escrowAmount,
                serviceFee: b.serviceFee,
                status: b.status,
                reference: b.referenceNumber,
                listing: b.listing,
              }))
            : [];
          bookingCache.set(cacheKey, { data: mapped, timestamp: Date.now() });
          setData(mapped);
          setIsLoading(false);
          return;
        }
        throw new Error(`Failed to fetch bookings: ${res.status}`);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err.message || "Failed to load bookings");
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

// Hook for booking by reference — REST API only
export function useBookingByReference(reference: string) {
  const [data, setData] = useState<any>(undefined);
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
              _id: raw.id,
              reference: raw.referenceNumber,
              status: raw.status,
              totalPrice: raw.totalPrice,
              listing: raw.listing,
            });
            setIsLoading(false);
            return;
          }
        }
        throw new Error(`Booking not found: ${reference}`);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err.message || "Failed to load booking");
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

// Create booking via REST API only — no demo fallback
export function useCreateBooking() {
  const createBooking = useCallback(
    async (bookingData: {
      userId: string;
      listingId: string;
      startDate: string;
      endDate: string;
      totalPrice: number;
      escrowAmount: number;
      serviceFee: number;
    }) => {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      if (!res.ok) {
        throw new Error(`Booking creation failed: ${res.status}`);
      }
      const result = await res.json();
      return { reference: result.referenceNumber };
    },
    []
  );

  return { createBooking };
}

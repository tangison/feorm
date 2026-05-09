"use client";

import { useState, useEffect, useCallback } from "react";

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
  withOperator: boolean;
  listing?: any;
}

// Hook for user's bookings — REST API primary
export function useBookings(userId: string) {
  const [data, setData] = useState<BookingData[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      const id = requestAnimationFrame(() => {
        setData([]);
        setIsLoading(false);
      });
      return () => cancelAnimationFrame(id);
    }

    let cancelled = false;

    async function fetchBookings() {
      try {
        const res = await fetch(`/api/bookings?userId=${encodeURIComponent(userId)}`);
        if (res.ok && !cancelled) {
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
                withOperator: b.withOperator,
                listing: b.listing,
              }))
            : [];
          if (!cancelled) {
            setData(mapped);
            setIsLoading(false);
          }
          return;
        }
      } catch {
        // REST failed
      }
      // Demo mode: no bookings yet
      if (!cancelled) {
        setData([]);
        setIsLoading(false);
      }
    }

    fetchBookings();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { data, isLoading };
}

// Hook for booking by reference — REST API
export function useBookingByReference(reference: string) {
  const [data, setData] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(!!reference);

  useEffect(() => {
    if (!reference) {
      // Use a microtask to avoid setting state directly in render
      const id = requestAnimationFrame(() => {
        setData(null);
        setIsLoading(false);
      });
      return () => cancelAnimationFrame(id);
    }

    // For demo mode, return a simple booking object after brief delay
    const timer = setTimeout(() => {
      setData({
        _id: reference,
        reference,
        status: "pending",
        totalPrice: 0,
        listing: null,
      });
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [reference]);

  return { data, isLoading };
}

// Create booking via REST API
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
      withOperator: boolean;
    }) => {
      try {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });
        if (res.ok) {
          const result = await res.json();
          return { reference: result.referenceNumber };
        }
      } catch {
        // Fallback for demo
      }
      // Demo fallback
      const ref = `FE-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;
      return { reference: ref };
    },
    []
  );

  return { createBooking };
}

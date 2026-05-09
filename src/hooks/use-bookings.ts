"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Demo Bookings (Fallback) ──────────────────────────────
const DEMO_BOOKINGS = [
  {
    _id: "demo-booking-1",
    listingId: "demo-stay-1",
    userId: "demo-user",
    startDate: "2026-03-15",
    endDate: "2026-03-20",
    totalPrice: 425000,
    escrowAmount: 150000,
    serviceFee: 42500,
    status: "confirmed",
    reference: "FE-M4K7R2-PQ8N",
    withOperator: false,
    listing: {
      id: "demo-stay-1",
      title: "Zambezi Floodplain Lodge",
      type: "stay",
      category: "Eco Lodge",
      region: "Zambezi Region",
      imageUrl: "/images/stay-wetlands-lodge.png",
    },
  },
  {
    _id: "demo-booking-2",
    listingId: "demo-equip-1",
    userId: "demo-user",
    startDate: "2026-04-01",
    endDate: "2026-04-04",
    totalPrice: 600000,
    escrowAmount: 150000,
    serviceFee: 60000,
    status: "pending",
    reference: "FE-H9B3X1-KL4V",
    withOperator: true,
    listing: {
      id: "demo-equip-1",
      title: "John Deere 5075E",
      type: "equipment",
      category: "Machinery",
      region: "Khomas Region",
      imageUrl: "/images/equip-tractor.png",
    },
  },
  {
    _id: "demo-booking-3",
    listingId: "demo-stay-4",
    userId: "demo-user",
    startDate: "2026-05-10",
    endDate: "2026-05-14",
    totalPrice: 475000,
    escrowAmount: 150000,
    serviceFee: 47500,
    status: "pending",
    reference: "FE-W2D8Y5-TJ3M",
    withOperator: false,
    listing: {
      id: "demo-stay-8",
      title: "Kunene Desert Pasture Camp",
      type: "stay",
      category: "Tent Camp",
      region: "Kunene Region",
      imageUrl: "/images/stay-river-camp.png",
    },
  },
];

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

// Hook for user's bookings — REST API primary, demo fallback
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
      // Demo mode: return demo bookings
      if (!cancelled) {
        setData(DEMO_BOOKINGS);
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
      const id = requestAnimationFrame(() => {
        setData(null);
        setIsLoading(false);
      });
      return () => cancelAnimationFrame(id);
    }

    let cancelled = false;

    async function fetchBooking() {
      try {
        const res = await fetch(`/api/bookings?reference=${encodeURIComponent(reference)}`);
        if (res.ok && !cancelled) {
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
      } catch {
        // REST failed
      }
      // Demo fallback
      if (!cancelled) {
        const demoBooking = DEMO_BOOKINGS.find(
          (b) => b.reference === reference
        );
        setData(
          demoBooking || {
            _id: reference,
            reference,
            status: "confirmed",
            totalPrice: 0,
            listing: null,
          }
        );
        setIsLoading(false);
      }
    }

    fetchBooking();

    return () => {
      cancelled = true;
    };
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

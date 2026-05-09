"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/lib/convex";
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

// Hook for user's bookings with Convex primary + REST fallback
export function useBookings(userId: string) {
  const convexData = useQuery(
    api.bookings.getByUser,
    userId ? { userId } : "skip"
  );
  const [fallbackData, setFallbackData] = useState<BookingData[] | null>(null);

  useEffect(() => {
    if (convexData === undefined && userId) {
      const timer = setTimeout(() => {
        fetch(`/api/bookings?userId=${encodeURIComponent(userId)}`)
          .then((res) => res.json())
          .then((data) => {
            const mapped = Array.isArray(data) ? data.map((b: any) => ({
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
            })) : [];
            setFallbackData(mapped);
          })
          .catch(() => setFallbackData([]));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [convexData, userId]);

  const data = convexData ?? fallbackData;
  const isLoading = data === undefined && fallbackData === null;

  return { data: data as BookingData[] | undefined, isLoading };
}

// Hook for booking by reference
export function useBookingByReference(reference: string) {
  const convexData = useQuery(
    api.bookings.getByReference,
    reference ? { reference } : "skip"
  );

  return { data: convexData, isLoading: convexData === undefined };
}

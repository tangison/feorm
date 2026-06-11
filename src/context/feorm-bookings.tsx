"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────
interface Listing {
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
}

interface Booking {
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
  listing: Listing;
}

interface FeormBookingContextType {
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  latestRef: string;
  setLatestRef: (ref: string) => void;
}

const FeormBookingContext = createContext<FeormBookingContextType | null>(null);

export function FeormBookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [latestRef, setLatestRef] = useState("");

  return (
    <FeormBookingContext.Provider
      value={{ bookings, setBookings, latestRef, setLatestRef }}
    >
      {children}
    </FeormBookingContext.Provider>
  );
}

export function useFeormBookings() {
  const ctx = useContext(FeormBookingContext);
  if (!ctx) {
    throw new Error(
      "useFeormBookings must be used within a FeormBookingProvider"
    );
  }
  return ctx;
}

export type { Booking };

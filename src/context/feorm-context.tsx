"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
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
  withOperator: boolean;
  listing: Listing;
}

interface FeormUser {
  id: string;
  phone: string;
  name?: string;
  surname?: string;
  region?: string;
  role: string;
  verified: boolean;
}

type MarketView = "stays" | "equipment";

interface FeormContextType {
  // User session
  user: FeormUser | null;
  setUser: (user: FeormUser | null) => void;
  phone: string;
  setPhone: (phone: string) => void;

  // Marketplace
  marketView: MarketView;
  setMarketView: (view: MarketView) => void;
  listings: Listing[];
  setListings: (listings: Listing[]) => void;

  // Selected listing for detail/booking flow
  selectedListing: Listing | null;
  setSelectedListing: (listing: Listing | null) => void;

  // Bookings
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;

  // Latest booking reference
  latestRef: string;
  setLatestRef: (ref: string) => void;
}

const FeormContext = createContext<FeormContextType | null>(null);

function loadSession(): { user: FeormUser | null; phone: string } {
  if (typeof window === "undefined") return { user: null, phone: "" };
  try {
    const saved = localStorage.getItem("feorm-session");
    if (saved) {
      const session = JSON.parse(saved);
      return {
        user: session.user || null,
        phone: session.phone || "",
      };
    }
  } catch {
    // Ignore localStorage errors
  }
  return { user: null, phone: "" };
}

export function FeormProvider({ children }: { children: ReactNode }) {
  const [session] = useState(loadSession);
  const [user, setUser] = useState<FeormUser | null>(session.user);
  const [phone, setPhone] = useState(session.phone);
  const [marketView, setMarketView] = useState<MarketView>("stays");
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [latestRef, setLatestRef] = useState("");

  // Persist session to localStorage when user/phone changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "feorm-session",
        JSON.stringify({ user, phone })
      );
    } catch {
      // Ignore localStorage errors
    }
  }, [user, phone]);

  return (
    <FeormContext.Provider
      value={{
        user,
        setUser,
        phone,
        setPhone,
        marketView,
        setMarketView,
        listings,
        setListings,
        selectedListing,
        setSelectedListing,
        bookings,
        setBookings,
        latestRef,
        setLatestRef,
      }}
    >
      {children}
    </FeormContext.Provider>
  );
}

export function useFeorm() {
  const ctx = useContext(FeormContext);
  if (!ctx) {
    throw new Error("useFeorm must be used within a FeormProvider");
  }
  return ctx;
}

export type { Listing, Booking, FeormUser, MarketView };

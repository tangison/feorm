"use client";

import React, {
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
  role: "explorer" | "lister" | "voyager" | "provider";
  verified: boolean;
  avatarUrl?: string;
  interests?: string[];
  hasCompletedOnboarding?: boolean;
}

type MarketView = "stays" | "equipment";

interface FeormContextType {
  // User session
  user: FeormUser | null;
  setUser: React.Dispatch<React.SetStateAction<FeormUser | null>>;
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

  // Onboarding
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  selectedRole: "voyager" | "provider" | null;
  setSelectedRole: (role: "voyager" | "provider" | null) => void;
  interests: string[];
  setInterests: (interests: string[]) => void;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
  providerAssets: ("stay" | "equipment")[];
  setProviderAssets: (assets: ("stay" | "equipment")[]) => void;
}

const FeormContext = createContext<FeormContextType | null>(null);

function loadSession(): {
  user: FeormUser | null;
  phone: string;
  selectedRole: "voyager" | "provider" | null;
  interests: string[];
  avatarUrl: string;
  hasCompletedOnboarding: boolean;
  providerAssets: ("stay" | "equipment")[];
} {
  if (typeof window === "undefined")
    return {
      user: null,
      phone: "",
      selectedRole: null,
      interests: [],
      avatarUrl: "",
      hasCompletedOnboarding: false,
      providerAssets: [],
    };
  try {
    const saved = localStorage.getItem("feorm-session");
    if (saved) {
      const session = JSON.parse(saved);
      return {
        user: session.user || null,
        phone: session.phone || "",
        selectedRole: session.selectedRole || null,
        interests: session.interests || [],
        avatarUrl: session.avatarUrl || "",
        hasCompletedOnboarding: session.hasCompletedOnboarding || false,
        providerAssets: session.providerAssets || [],
      };
    }
  } catch {
    // Ignore localStorage errors
  }
  return {
    user: null,
    phone: "",
    selectedRole: null,
    interests: [],
    avatarUrl: "",
    hasCompletedOnboarding: false,
    providerAssets: [],
  };
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

  // Onboarding state
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<"voyager" | "provider" | null>(
    session.selectedRole
  );
  const [interests, setInterests] = useState<string[]>(session.interests);
  const [avatarUrl, setAvatarUrl] = useState(session.avatarUrl);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(
    session.hasCompletedOnboarding
  );
  const [providerAssets, setProviderAssets] = useState<("stay" | "equipment")[]>(
    session.providerAssets
  );

  // Persist session to localStorage when user/phone/role/interests/avatar changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "feorm-session",
        JSON.stringify({
          user,
          phone,
          selectedRole,
          interests,
          avatarUrl,
          hasCompletedOnboarding,
          providerAssets,
        })
      );
    } catch {
      // Ignore localStorage errors
    }
  }, [user, phone, selectedRole, interests, avatarUrl, hasCompletedOnboarding, providerAssets]);

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
        onboardingStep,
        setOnboardingStep,
        selectedRole,
        setSelectedRole,
        interests,
        setInterests,
        avatarUrl,
        setAvatarUrl,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
        providerAssets,
        setProviderAssets,
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

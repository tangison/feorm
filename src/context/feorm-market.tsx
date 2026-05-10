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

type MarketView = "stays" | "equipment";

interface FeormMarketContextType {
  marketView: MarketView;
  setMarketView: (view: MarketView) => void;
  listings: Listing[];
  setListings: (listings: Listing[]) => void;
  selectedListing: Listing | null;
  setSelectedListing: (listing: Listing | null) => void;
}

const FeormMarketContext = createContext<FeormMarketContextType | null>(null);

export function FeormMarketProvider({ children }: { children: ReactNode }) {
  const [marketView, setMarketView] = useState<MarketView>("stays");
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  return (
    <FeormMarketContext.Provider
      value={{
        marketView,
        setMarketView,
        listings,
        setListings,
        selectedListing,
        setSelectedListing,
      }}
    >
      {children}
    </FeormMarketContext.Provider>
  );
}

export function useFeormMarket() {
  const ctx = useContext(FeormMarketContext);
  if (!ctx) {
    throw new Error("useFeormMarket must be used within a FeormMarketProvider");
  }
  return ctx;
}

export type { Listing, MarketView };

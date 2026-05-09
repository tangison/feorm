"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useFeorm } from "@/context/feorm-context";
import ListingCard from "@/components/feorm/listing-card";

export default function MarketplacePage() {
  const { marketView, setMarketView, listings, setListings } = useFeorm();
  const searchParams = useSearchParams();

  // Read view from URL on mount
  useEffect(() => {
    const view = searchParams.get("view");
    if (view === "stays" || view === "equipment") {
      setMarketView(view);
    }
  }, [searchParams, setMarketView]);

  // Fetch listings when market view changes
  useEffect(() => {
    const type = marketView === "stays" ? "stay" : "equipment";
    fetch(`/api/listings?type=${type}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setListings(data);
      })
      .catch(() => {});
  }, [marketView, setListings]);

  const currentListings = listings;

  return (
    <div className="flex-grow w-full max-w-6xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h2 className="font-serif-display text-4xl md:text-5xl text-[#1E1A14] mb-3">
            {marketView === "stays" ? "Farm Stays" : "Equipment Exchange"}
          </h2>
          <p className="text-sm text-[#787774] max-w-lg">
            {marketView === "stays"
              ? "Authentic agrotourism provisions across the Namibian landscape."
              : "Peer-to-peer machinery rentals secured via escrow protocol."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono-feorm text-[10px] text-[#787774] uppercase tracking-widest">
            Filter:
          </span>
          <button className="border border-[#3C2F1A]/10 bg-[#FEFDFB] px-3 py-1.5 rounded-full text-xs hover:bg-[#FAF7F2] transition-colors">
            Region
          </button>
          <button className="border border-[#3C2F1A]/10 bg-[#FEFDFB] px-3 py-1.5 rounded-full text-xs hover:bg-[#FAF7F2] transition-colors">
            Availability
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {currentListings.map((item) => (
          <ListingCard key={item.id} item={item} />
        ))}
      </div>

      {currentListings.length === 0 && (
        <div className="border border-dashed border-[#D4C4A0]/50 bg-[#FEFDFB] rounded-[8px] p-12 text-center">
          <p className="text-sm text-[#787774]">
            Loading listings...
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFeorm } from "@/context/feorm-context";
import ListingCard from "@/components/feorm/listing-card";
import { useListings } from "@/hooks/use-listings";

function MarketplaceContent() {
  const { marketView, setMarketView } = useFeorm();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read view from URL on mount
  useEffect(() => {
    const view = searchParams.get("view");
    if (view === "stays" || view === "equipment") {
      setMarketView(view);
    }
  }, [searchParams, setMarketView]);

  // REST API query for listings
  const { data: listings, isLoading } = useListings(
    marketView === "stays" ? "stay" : "equipment"
  );

  return (
    <div className="flex-grow w-full max-w-6xl mx-auto px-6 py-12 md:py-24">
      {/* Header with toggle */}
      <div className="mb-12 md:mb-16">
        {/* Pill Toggle: Farm Stays | Equipment */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => {
              setMarketView("stays");
              router.push("/marketplace?view=stays");
            }}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium transition-all min-h-[44px] ${
              marketView === "stays"
                ? "bg-[#1E1A14] text-[#FEFDFB]"
                : "bg-transparent border border-[#3C2F1A]/10 text-[#787774] hover:bg-[#FAF7F2]"
            }`}
          >
            Farm Stays
          </button>
          <button
            onClick={() => {
              setMarketView("equipment");
              router.push("/marketplace?view=equipment");
            }}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium transition-all min-h-[44px] ${
              marketView === "equipment"
                ? "bg-[#1E1A14] text-[#FEFDFB]"
                : "bg-transparent border border-[#3C2F1A]/10 text-[#787774] hover:bg-[#FAF7F2]"
            }`}
          >
            Equipment
          </button>
          <span className="hidden md:inline-block mx-2 text-[#D4C4A0]">|</span>
          <span className="hidden md:inline-block font-mono-feorm text-[10px] text-[#787774] uppercase tracking-widest">
            {listings?.length || 0} listings
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
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
            <button className="border border-[#3C2F1A]/10 bg-[#FEFDFB] px-3 py-1.5 rounded-full text-xs hover:bg-[#FAF7F2] transition-colors">
              Region
            </button>
            <button className="border border-[#3C2F1A]/10 bg-[#FEFDFB] px-3 py-1.5 rounded-full text-xs hover:bg-[#FAF7F2] transition-colors">
              Availability
            </button>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="mb-8 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#E8C96A] animate-pulse" />
          <span className="font-mono-feorm text-[10px] text-[#787774] uppercase tracking-widest">
            Loading marketplace...
          </span>
        </div>
      )}

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {listings?.map((item: any) => (
          <ListingCard
            key={item._id}
            item={{
              id: item._id,
              title: item.title,
              region: item.region,
              price: item.price,
              type: item.type,
              category: item.category,
              description: item.description,
              imageUrl: item.image,
              features: Array.isArray(item.features)
                ? item.features.join(",")
                : item.features,
              hostId: "",
              hostName: item.hostName,
              hostPhone: item.hostPhone,
              available: item.available,
            }}
          />
        ))}
      </div>

      {/* Empty state */}
      {listings?.length === 0 && !isLoading && (
        <div className="border border-dashed border-[#D4C4A0]/50 bg-[#FEFDFB] rounded-[8px] p-12 text-center">
          <p className="text-sm text-[#787774]">
            No listings found. The network is still growing.
          </p>
        </div>
      )}
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="flex-grow flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#E8C96A] animate-pulse" />
            <span className="font-mono-feorm text-[10px] text-[#787774] uppercase tracking-widest">
              Loading...
            </span>
          </div>
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}

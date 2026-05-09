"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFeormMarket } from "@/context/feorm-context";
import ListingCard from "@/components/feorm/listing-card";
import { useListings } from "@/hooks/use-listings";
import { ChevronDown, X } from "lucide-react";

const NAMIBIAN_REGIONS = [
  "All Regions",
  "Zambezi",
  "Kavango East",
  "Kavango West",
  "Ohangwena",
  "Oshana",
  "Omusati",
  "Oshikoto",
  "Kunene",
  "Erongo",
  "Otjozondjupa",
  "Khomas",
  "Hardap",
  "Karas",
  "Omaheke",
];

// Pure transform — used inside useMemo to preserve referential stability
function transformItem(item: any) {
  return {
    id: item._id,
    title: item.title,
    region: item.region,
    price: item.price,
    type: item.type,
    category: item.category,
    description: item.description,
    imageUrl: item.image,
    features: Array.isArray(item.features) ? item.features.join(",") : item.features,
    hostId: "",
    hostName: item.hostName,
    hostPhone: item.hostPhone,
    available: item.available,
  };
}

function MarketplaceContent() {
  const { marketView, setMarketView } = useFeormMarket();
  const searchParams = useSearchParams();
  const router = useRouter();

  const regionFromParams = searchParams.get("region") || "All Regions";
  const [selectedRegion, setSelectedRegion] = useState(regionFromParams);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  useEffect(() => {
    const view = searchParams.get("view");
    if (view === "stays" || view === "equipment") {
      setMarketView(view);
    }
  }, [searchParams, setMarketView]);

  // Sync region from URL params (only when param changes)
  const currentParamRegion = searchParams.get("region") || "All Regions";
  useEffect(() => {
    setSelectedRegion(currentParamRegion);
  }, [currentParamRegion]);

  const { data: listings, isLoading } = useListings(
    marketView === "stays" ? "stay" : "equipment"
  );

  // Filter listings by region and availability, then transform for stable refs
  // This is memoized so ListingCard's React.memo comparison works correctly
  const transformedListings = useMemo(() => {
    if (!listings) return [];
    let filtered = listings;
    if (selectedRegion !== "All Regions") {
      filtered = filtered.filter((item: any) =>
        item.region?.toLowerCase().includes(selectedRegion.toLowerCase())
      );
    }
    if (showAvailableOnly) {
      filtered = filtered.filter((item: any) => item.available !== false);
    }
    return filtered.map(transformItem);
  }, [listings, selectedRegion, showAvailableOnly]);

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setRegionDropdownOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    if (region === "All Regions") {
      params.delete("region");
    } else {
      params.set("region", region);
    }
    router.push(`/marketplace?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedRegion("All Regions");
    setShowAvailableOnly(false);
    router.push("/marketplace");
  };

  const hasActiveFilters =
    selectedRegion !== "All Regions" || showAvailableOnly;

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
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium transition-all duration-200 min-h-[44px] ${
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
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium transition-all duration-200 min-h-[44px] ${
              marketView === "equipment"
                ? "bg-[#1E1A14] text-[#FEFDFB]"
                : "bg-transparent border border-[#3C2F1A]/10 text-[#787774] hover:bg-[#FAF7F2]"
            }`}
          >
            Equipment
          </button>
          <span className="hidden md:inline-block mx-2 text-[#D4C4A0]">|</span>
          <span className="hidden md:inline-block font-mono-feorm text-[10px] text-[#787774] uppercase tracking-widest">
            {transformedListings?.length || 0} listings
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <h2 className="font-serif-display text-4xl md:text-5xl text-[#1E1A14] mb-3 tracking-tight">
              {marketView === "stays" ? "Farm Stays" : "Equipment Exchange"}
            </h2>
            <p className="text-sm text-[#787774] max-w-lg leading-relaxed">
              {marketView === "stays"
                ? "Authentic agrotourism provisions across the Namibian landscape."
                : "Peer-to-peer machinery rentals secured via escrow protocol."}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Region Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
                className={`border px-3 py-1.5 rounded-full text-xs hover:bg-[#FAF7F2] transition-colors flex items-center gap-1.5 min-h-[36px] ${
                  selectedRegion !== "All Regions"
                    ? "border-[#1E1A14] bg-[#1E1A14] text-[#FEFDFB]"
                    : "border-[#3C2F1A]/10 bg-[#FEFDFB]"
                }`}
                aria-expanded={regionDropdownOpen}
                aria-haspopup="listbox"
                aria-label="Filter by region"
              >
                {selectedRegion === "All Regions" ? "Region" : selectedRegion}
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${
                    regionDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {regionDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-48 bg-[#FEFDFB] border border-[#3C2F1A]/10 rounded-[8px] shadow-lg z-50 max-h-80 overflow-y-auto"
                  role="listbox"
                  aria-label="Select region"
                >
                  {NAMIBIAN_REGIONS.map((region) => (
                    <button
                      key={region}
                      onClick={() => handleRegionSelect(region)}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-[#FAF7F2] transition-colors ${
                        selectedRegion === region
                          ? "font-medium text-[#1E1A14] bg-[#FAF7F2]"
                          : "text-[#787774]"
                      } ${region === "All Regions" ? "border-b border-[#3C2F1A]/5" : ""}`}
                      role="option"
                      aria-selected={selectedRegion === region}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Availability Toggle */}
            <button
              onClick={() => setShowAvailableOnly(!showAvailableOnly)}
              className={`border px-3 py-1.5 rounded-full text-xs transition-colors min-h-[36px] ${
                showAvailableOnly
                  ? "border-[#1E1A14] bg-[#1E1A14] text-[#FEFDFB]"
                  : "border-[#3C2F1A]/10 bg-[#FEFDFB] hover:bg-[#FAF7F2]"
              }`}
              aria-pressed={showAvailableOnly}
            >
              Available
            </button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="border border-[#9F2F2D]/20 px-3 py-1.5 rounded-full text-xs text-[#9F2F2D] hover:bg-[#FDEBEC] transition-colors min-h-[36px] flex items-center gap-1.5"
                aria-label="Clear all filters"
              >
                <X size={10} />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading skeleton — dimensions match ListingCard exactly */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bento-card flex flex-col">
              <div className="h-56 p-2">
                <div className="w-full h-full skeleton-shimmer rounded-[4px]" />
              </div>
              <div className="p-5 md:p-6 border-t border-[#3C2F1A]/5">
                <div className="h-3 w-20 skeleton-shimmer mb-4" />
                <div className="h-6 w-3/4 skeleton-shimmer mb-3" />
                <div className="h-4 w-1/3 skeleton-shimmer mt-6" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bento Grid with stagger reveal */}
      {!isLoading && transformedListings && transformedListings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 stagger-reveal">
          {transformedListings.map((item) => (
            <ListingCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {transformedListings?.length === 0 && !isLoading && (
        <div className="border border-dashed border-[#D4C4A0]/50 bg-[#FEFDFB] rounded-[8px] p-12 text-center">
          <p className="text-sm text-[#787774] mb-4">
            No listings found{selectedRegion !== "All Regions" ? ` in ${selectedRegion}` : ""}.
            The network is still growing.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn-secondary-feorm px-5 py-2.5 text-xs uppercase tracking-widest"
            >
              Clear Filters
            </button>
          )}
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

"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFeormMarket } from "@/context/feorm-context";
import ListingCard from "@/components/feorm/listing-card";
import Image from "next/image";
import { useListings } from "@/hooks/use-listings";
import { ChevronDown, X, SlidersHorizontal, Map, LayoutGrid } from "lucide-react";
import { NAMIBIAN_REGIONS } from "@/lib/regions";
import dynamic from "next/dynamic";

// Dynamic import for map (SSR: false — MapLibre needs browser APIs)
const ListingsMap = dynamic(
  () => import("@/components/feorm/listings-map"),
  { ssr: false }
);

const REGION_OPTIONS = ["All Regions", ...NAMIBIAN_REGIONS] as const;

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
    lat: item.lat,
    lng: item.lng,
  };
}

type ViewMode = "grid" | "map";

function MarketplaceContent() {
  const { marketView, setMarketView } = useFeormMarket();
  const searchParams = useSearchParams();
  const router = useRouter();

  const regionFromParams = searchParams.get("region") || "All Regions";
  const [selectedRegion, setSelectedRegion] = useState(regionFromParams);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  useEffect(() => {
    if (!regionDropdownOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setRegionDropdownOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [regionDropdownOpen]);

  useEffect(() => {
    const view = searchParams.get("view");
    if (view === "stays") {
      setMarketView(view);
    }
  }, [searchParams, setMarketView]);

  const currentParamRegion = searchParams.get("region") || "All Regions";
  useEffect(() => {
    setSelectedRegion(currentParamRegion);
  }, [currentParamRegion]);

  const { data: listings, isLoading } = useListings("stay");

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
    <div className="flex-grow w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-12 lg:py-16">
      {/* View Header */}
      <div className="flex items-center gap-2 mb-5 md:mb-8">
        <span className="hidden md:inline-block font-mono-feorm text-[9px] text-muted-foreground uppercase tracking-widest ml-3">
          {transformedListings?.length || 0} farm stays
        </span>

        {/* Grid/Map Toggle */}
        <div className="ml-auto flex items-center border border-earth/8 rounded-full overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-2 text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1 min-h-[36px] ${
              viewMode === "grid"
                ? "bg-earth text-white-feorm"
                : "bg-white-feorm text-muted-foreground hover:bg-fog"
            }`}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
          >
            <LayoutGrid size={12} />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`px-3 py-2 text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1 min-h-[36px] ${
              viewMode === "map"
                ? "bg-earth text-white-feorm"
                : "bg-white-feorm text-muted-foreground hover:bg-fog"
            }`}
            aria-label="Map view"
            aria-pressed={viewMode === "map"}
          >
            <Map size={12} />
            <span className="hidden sm:inline">Map</span>
          </button>
        </div>
      </div>

      {/* Title + Filters */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 md:gap-6 mb-6 md:mb-10">
        <div>
          <h1 className="font-serif-display text-3xl md:text-4xl lg:text-5xl text-earth mb-1.5 tracking-tight">
            Find Your Farm Stay
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground max-w-md leading-relaxed">
            Book a stay on a real Namibian farm — cattle ranches, bush camps, riverfront lodges, and homesteads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Region Filter */}
          <div className="relative">
            <button
              onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
              className={`border px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1 min-h-[36px] ${
                selectedRegion !== "All Regions"
                  ? "border-earth bg-earth text-white-feorm"
                  : "border-earth/8 bg-white-feorm hover:bg-fog"
              }`}
              aria-expanded={regionDropdownOpen}
              aria-haspopup="listbox"
              aria-label="Filter by region"
            >
              {selectedRegion === "All Regions" ? "Region" : selectedRegion}
              <ChevronDown
                size={10}
                className={`transition-transform duration-200 ${
                  regionDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {regionDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-44 bg-white-feorm border border-earth/8 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto"
                role="listbox"
                aria-label="Select region"
              >
                {REGION_OPTIONS.map((region) => (
                  <button
                    key={region}
                    onClick={() => handleRegionSelect(region)}
                    className={`w-full text-left px-3.5 py-2.5 text-[11px] hover:bg-fog transition-colors ${
                      selectedRegion === region
                        ? "font-medium text-earth bg-fog"
                        : "text-muted-foreground"
                    } ${region === "All Regions" ? "border-b border-earth/5" : ""}`}
                    role="option"
                    aria-selected={selectedRegion === region}
                  >
                    {region}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Available Toggle */}
          <button
            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
            className={`border px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider transition-colors min-h-[36px] ${
              showAvailableOnly
                ? "border-earth bg-earth text-white-feorm"
                : "border-earth/8 bg-white-feorm hover:bg-fog"
            }`}
            aria-pressed={showAvailableOnly}
          >
            Available
          </button>

          {/* Clear */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="border border-destructive/15 px-2.5 py-1.5 rounded-full text-[10px] text-destructive hover:bg-destructive-bg transition-colors min-h-[36px] flex items-center gap-1"
              aria-label="Clear all filters"
            >
              <X size={10} />
            </button>
          )}
        </div>
      </div>

      {/* Category Banner */}
      <div className="relative w-full h-32 md:h-40 rounded-xl overflow-hidden mb-6 md:mb-8">
        <Image
          src="/images/banner-stays.png"
          alt="Farm stays across Namibia"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-earth/50 to-transparent" />
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bento-card flex flex-col">
              <div className="h-48 md:h-56 p-2">
                <div className="w-full h-full skeleton-shimmer rounded-md" />
              </div>
              <div className="p-4 md:p-5 border-t border-earth/5">
                <div className="h-2.5 w-16 skeleton-shimmer mb-3" />
                <div className="h-5 w-3/4 skeleton-shimmer mb-2" />
                <div className="h-3.5 w-1/3 skeleton-shimmer mt-5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Map View */}
      {!isLoading && viewMode === "map" && (
        <div>
          <ListingsMap listings={transformedListings} />
          {/* Below the map, show a compact list */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {transformedListings.map((item) => (
              <ListingCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Grid View */}
      {!isLoading && viewMode === "grid" && transformedListings && transformedListings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 stagger-reveal">
          {transformedListings.map((item) => (
            <ListingCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Empty */}
      {transformedListings?.length === 0 && !isLoading && (
        <div className="border border-dashed border-sand/40 bg-white-feorm rounded-lg p-10 text-center">
          <Image
            src="/images/empty-listings.png"
            alt=""
            width={200}
            height={200}
            className="mx-auto mb-4 rounded-lg opacity-80"
          />
          <p className="text-xs text-muted-foreground mb-4">
            No farm stays found{selectedRegion !== "All Regions" ? ` in ${selectedRegion}. Check back soon — new stays appear every week.` : " yet. We're adding new farms regularly."}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn-secondary-feorm px-4 py-2 text-[10px] uppercase tracking-widest"
            >
              Clear All Filters
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
            <div className="w-1.5 h-1.5 rounded-full bg-harvest animate-pulse" />
            <span className="font-mono-feorm text-[9px] text-muted-foreground uppercase tracking-widest">
              Finding farm stays
            </span>
          </div>
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}

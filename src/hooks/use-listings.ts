"use client";

import { useState, useEffect, useRef } from "react";

// ─── Types ──────────────────────────────────────────────────────
export interface ListingItem {
  _id: string;
  title: string;
  type: string;
  region: string;
  price: number;
  description: string;
  image: string;
  images: string[];
  features: string[];
  category: string;
  hostName: string;
  hostPhone: string;
  available: boolean;
  lat: number | null;
  lng: number | null;
  rating?: number;
  reviewCount?: number;
}

// ─── Request Deduplication Cache ────────────────────────────────
const listingCache = new Map<string, { data: ListingItem[]; timestamp: number }>();
const CACHE_TTL = 30_000; // 30 seconds

// ─── Helpers ────────────────────────────────────────────────────
function mapListingResponse(item: Record<string, unknown>): ListingItem {
  const imageUrl = (item.imageUrl as string) || "/images/listing-stay-hero.png";
  return {
    _id: item.id as string,
    title: item.title as string,
    type: item.type as string,
    region: item.region as string,
    price: item.price as number,
    description: item.description as string,
    image: imageUrl,
    images: (item.images as string[]) || [imageUrl],
    features: item.features
      ? (item.features as string).split(",").map((f: string) => f.trim())
      : [],
    category: item.category as string,
    hostName: item.hostName as string,
    hostPhone: item.hostPhone as string,
    available: item.available as boolean,
    lat: (item.lat as number | null) ?? null,
    lng: (item.lng as number | null) ?? null,
    rating: item.rating as number | undefined,
    reviewCount: item.reviewCount as number | undefined,
  };
}

// ─── Hooks ─────────────────────────────────────────────────────

export function useListings(type: "stay") {
  const [data, setData] = useState<ListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentTypeRef = useRef(type);

  useEffect(() => {
    currentTypeRef.current = type;
    const controller = new AbortController();

    async function fetchListings() {
      setIsLoading(true);
      setError(null);

      const cacheKey = `listings-${type}`;
      const cached = listingCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setData(cached.data);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/listings?type=${type}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const raw = await res.json();
          const mapped: ListingItem[] = Array.isArray(raw)
            ? raw.map((item: Record<string, unknown>) => mapListingResponse(item))
            : [];
          listingCache.set(cacheKey, { data: mapped, timestamp: Date.now() });
          if (currentTypeRef.current === type) {
            setData(mapped);
          }
          setIsLoading(false);
          return;
        }
        throw new Error(`Failed to fetch listings: ${res.status}`);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load listings");
      }
      setIsLoading(false);
    }

    fetchListings();

    return () => {
      controller.abort();
    };
  }, [type]);

  return { data, isLoading, error, source: "rest" as const };
}

export function useListing(id: string) {
  const [data, setData] = useState<ListingItem | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    async function fetchListing() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/listings?id=${encodeURIComponent(id)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const found = await res.json();
          if (found && !found.error) {
            setData(mapListingResponse(found));
            setIsLoading(false);
            return;
          }
        }
        throw new Error(`Listing not found: ${id}`);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load listing");
        setNotFound(true);
      }
      setIsLoading(false);
    }

    fetchListing();

    return () => {
      controller.abort();
    };
  }, [id]);

  return { data, isLoading: isLoading && data === null && !notFound, notFound, error };
}

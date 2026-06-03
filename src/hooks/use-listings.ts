"use client";

import { useState, useEffect, useRef } from "react";

// ─── Request Deduplication Cache ────────────────────────────────
const listingCache = new Map<string, { data: any[]; timestamp: number }>();
const CACHE_TTL = 30_000; // 30 seconds

// ─── Hooks ─────────────────────────────────────────────────────

export function useListings(type: "stay" | "equipment") {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentTypeRef = useRef(type);

  useEffect(() => {
    currentTypeRef.current = type;
    const controller = new AbortController();

    async function fetchListings() {
      setIsLoading(true);
      setError(null);

      // Check cache first for deduplication
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
          const mapped = raw.map((item: any) => ({
            _id: item.id,
            title: item.title,
            type: item.type,
            region: item.region,
            price: item.price,
            description: item.description,
            image: item.imageUrl,
            features: item.features ? item.features.split(",") : [],
            category: item.category,
            hostName: item.hostName,
            hostPhone: item.hostPhone,
            available: item.available,
          }));
          // Cache the result
          listingCache.set(cacheKey, { data: mapped, timestamp: Date.now() });
          if (currentTypeRef.current === type) {
            setData(mapped);
          }
          setIsLoading(false);
          return;
        }
        throw new Error(`Failed to fetch listings: ${res.status}`);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err.message || "Failed to load listings");
      }
      setIsLoading(false);
    }

    fetchListings();

    return () => {
      controller.abort();
    };
  }, [type]);

  return { data, isLoading, error, source: "rest" };
}

export function useListing(id: string) {
  const [data, setData] = useState<any | null>(null);
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
            setData({
              _id: found.id,
              title: found.title,
              type: found.type,
              region: found.region,
              price: found.price,
              description: found.description,
              image: found.imageUrl,
              features: found.features ? found.features.split(",") : [],
              category: found.category,
              hostName: found.hostName,
              hostPhone: found.hostPhone,
              available: found.available,
            });
            setIsLoading(false);
            return;
          }
        }
        throw new Error(`Listing not found: ${id}`);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err.message || "Failed to load listing");
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

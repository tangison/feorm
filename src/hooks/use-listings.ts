"use client";

import { useState, useEffect, useRef } from "react";
import { DEMO_STAYS, DEMO_EQUIPMENT, ALL_DEMO } from "@/data/demo-listings";

// ─── Request Deduplication Cache ────────────────────────────────
const listingCache = new Map<string, { data: any[]; timestamp: number }>();
const CACHE_TTL = 30_000; // 30 seconds

// ─── Hooks ─────────────────────────────────────────────────────

export function useListings(type: "stay" | "equipment") {
  // Initialize with demo data so there's no loading flash when offline
  const initialData = type === "stay" ? DEMO_STAYS : DEMO_EQUIPMENT;
  const [data, setData] = useState<any[]>(initialData);
  const currentTypeRef = useRef(type);

  useEffect(() => {
    currentTypeRef.current = type;
    const controller = new AbortController();

    async function fetchListings() {
      // Check cache first for deduplication
      const cacheKey = `listings-${type}`;
      const cached = listingCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setData(cached.data);
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
          return;
        }
      } catch (err: any) {
        // AbortError means the request was cancelled (type changed) — don't fall back
        if (err?.name === "AbortError") return;
        // REST failed, use demo data
      }
      // Fallback: already have demo data from initial state
    }

    fetchListings();

    return () => {
      controller.abort();
    };
  }, [type]);

  // Never loading since we start with demo data
  return { data, isLoading: false, source: "rest" };
}

export function useListing(id: string) {
  const [data, setData] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    async function fetchListing() {
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
            return;
          }
        }
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        // REST failed
      }
      // Fallback to static demo data
      const demoItem = ALL_DEMO.find((item) => item._id === id);
      if (demoItem) {
        setData(demoItem);
      } else {
        setNotFound(true);
      }
    }

    fetchListing();

    return () => {
      controller.abort();
    };
  }, [id]);

  return { data, isLoading: data === null && !notFound, notFound };
}

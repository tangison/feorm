"use client";

import { useQuery } from "convex/react";
import { api } from "@/lib/convex";
import { useState, useEffect } from "react";

interface ListingData {
  _id: string;
  title: string;
  type: string;
  region: string;
  price: number;
  description: string;
  image: string;
  features: string[];
  category: string;
  hostName: string;
  hostPhone: string;
  available: boolean;
}

// Hook with Convex primary + REST fallback
export function useListings(type: "stay" | "equipment") {
  const convexData = useQuery(api.listings.getByType, { type });
  const [fallbackData, setFallbackData] = useState<ListingData[] | null>(null);
  const [fallbackLoading, setFallbackLoading] = useState(false);

  useEffect(() => {
    // If Convex returns undefined (loading) for more than 3 seconds, try REST fallback
    if (convexData === undefined) {
      const timer = setTimeout(() => {
        setFallbackLoading(true);
        fetch(`/api/listings?type=${type}`)
          .then((res) => res.json())
          .then((data) => {
            // Map REST data to Convex-like shape
            const mapped = data.map((item: any) => ({
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
            setFallbackData(mapped);
          })
          .catch(() => setFallbackData([]))
          .finally(() => setFallbackLoading(false));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [convexData, type]);

  // Convex data takes priority; fall back to REST
  const data = convexData ?? fallbackData;
  const isLoading = data === null || data === undefined;

  return { data, isLoading, source: convexData ? "convex" : fallbackData ? "rest" : "loading" };
}

// Hook for single listing by ID
export function useListing(id: string) {
  const convexData = useQuery(api.listings.getById, id ? { id: id as any } : "skip");
  const [fallbackData, setFallbackData] = useState<ListingData | null>(null);
  const [fallbackLoading, setFallbackLoading] = useState(false);

  useEffect(() => {
    if (convexData === undefined && id) {
      const timer = setTimeout(() => {
        setFallbackLoading(true);
        fetch(`/api/listings?id=${id}`)
          .then((res) => res.json())
          .then((data) => setFallbackData(data))
          .catch(() => setFallbackData(null))
          .finally(() => setFallbackLoading(false));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [convexData, id]);

  const data = convexData ?? fallbackData;
  const isLoading = data === undefined && fallbackData === null;

  return { data, isLoading, source: convexData ? "convex" : fallbackData ? "rest" : "loading" };
}

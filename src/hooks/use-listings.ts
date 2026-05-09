"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Static Demo Data (Ultimate Fallback) ──────────────────────────
const DEMO_STAYS = [
  {
    _id: "demo-stay-1",
    title: "Otjozondjupa Cattle Farm",
    type: "stay",
    region: "Central Region",
    price: 85000,
    description:
      "Participate in the seasonal cattle harvest. Minimalist accommodations providing direct exposure to authentic pastoral operations. Meals sourced directly from the land.",
    image: "/images/stay-cattle-farm.png",
    features: ["Communal Dining", "Livestock Tracking", "Borehole Water"],
    category: "Working Farm",
    hostName: "Johan Deetlefs",
    hostPhone: "+264810000001",
    available: true,
  },
  {
    _id: "demo-stay-2",
    title: "Erongo Granite Lodge",
    type: "stay",
    region: "Coastal Inland",
    price: 120000,
    description:
      "Structural stone architecture integrated into the raw Erongo mountainside. Off-grid solar provision and extreme isolation for intensive operational retreats.",
    image: "/images/stay-granite-lodge.png",
    features: ["Off-grid Solar", "Hiking Trails", "High Altitude"],
    category: "Guest House",
    hostName: "Anna //Khaoes",
    hostPhone: "+264810000002",
    available: true,
  },
  {
    _id: "demo-stay-3",
    title: "Khomas Bush Walk",
    type: "stay",
    region: "Highlands",
    price: 65000,
    description:
      "Utilitarian canvas structures elevated on timber platforms. Focus on ecological observation and minimal impact habitation.",
    image: "/images/stay-bush-walk.png",
    features: ["Guided Walks", "Firepit", "Composting Toilet"],
    category: "Tent Camp",
    hostName: "Pieter Gaseb",
    hostPhone: "+264810000003",
    available: true,
  },
];

const DEMO_EQUIPMENT = [
  {
    _id: "demo-equip-1",
    title: "John Deere 5075E",
    type: "equipment",
    region: "Khomas Region",
    price: 150000,
    description:
      "75HP utility tractor. Clean service record. Optimized for dry-season plowing. Escrow protection and condition reporting mandatory prior to ignition.",
    image: "/images/equip-tractor.png",
    features: ["75 Horsepower", "Diesel", "Operator Optional"],
    category: "Machinery",
    hostName: "Johan Deetlefs",
    hostPhone: "+264810000001",
    available: true,
  },
  {
    _id: "demo-equip-2",
    title: "Industrial Water Pump",
    type: "equipment",
    region: "Hardap Region",
    price: 40000,
    description:
      "High-pressure diesel pump unit designed for seasonal deep-well extraction. Includes 10 meters of industrial-grade layflat piping.",
    image: "/images/equip-pump.png",
    features: ["High Pressure", "10m Piping", "Portable"],
    category: "Irrigation",
    hostName: "Frikkie Boois",
    hostPhone: "+264810000004",
    available: true,
  },
  {
    _id: "demo-equip-3",
    title: "Disc Harrow Implement",
    type: "equipment",
    region: "Omaheke",
    price: 35000,
    description:
      "Heavy-duty steel disc harrow for soil preparation. Standard three-point hitch compatible.",
    image: "/images/equip-harrow.png",
    features: ["3-Point Hitch", "Heavy Steel", "No Power Required"],
    category: "Attachment",
    hostName: "Kaita Tjirare",
    hostPhone: "+264810000005",
    available: true,
  },
];

const ALL_DEMO = [...DEMO_STAYS, ...DEMO_EQUIPMENT];

// ─── Hooks ─────────────────────────────────────────────────────────

export function useListings(type: "stay" | "equipment") {
  const [data, setData] = useState<any[] | null>(null);
  const currentTypeRef = useRef(type);

  useEffect(() => {
    currentTypeRef.current = type;
    let cancelled = false;

    async function fetchListings() {
      try {
        const res = await fetch(`/api/listings?type=${type}`);
        if (res.ok && !cancelled) {
          const raw = await res.json();
          // Map REST API data to Convex-like shape
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
          if (!cancelled) setData(mapped);
          return;
        }
      } catch {
        // REST failed, use demo data
      }
      // Fallback to static demo data
      if (!cancelled) {
        setData(type === "stay" ? DEMO_STAYS : DEMO_EQUIPMENT);
      }
    }

    fetchListings();

    return () => {
      cancelled = true;
    };
  }, [type]);

  return { data, isLoading: data === null, source: "rest" };
}

export function useListing(id: string) {
  const [data, setData] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function fetchListing() {
      try {
        // Try fetching single listing by ID directly
        const res = await fetch(`/api/listings?id=${encodeURIComponent(id)}`);
        if (res.ok && !cancelled) {
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
      } catch {
        // REST failed
      }
      // Fallback to static demo data
      if (!cancelled) {
        const demoItem = ALL_DEMO.find((item) => item._id === id);
        if (demoItem) {
          setData(demoItem);
        } else {
          setNotFound(true);
        }
      }
    }

    fetchListing();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { data, isLoading: data === null && !notFound, notFound };
}

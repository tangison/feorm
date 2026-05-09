"use client";

import { useState, useEffect, useRef } from "react";

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
  {
    _id: "demo-stay-4",
    title: "Kunene River Camp",
    type: "stay",
    region: "Northwest",
    price: 95000,
    description:
      "Desert oasis encampment perched above the Kunene River gorge. Canvas pavilions on raised timber decks with panoramic canyon views. Guided river crossings and Himba cultural exchange available.",
    image: "/images/stay-river-camp.png",
    features: ["Canyon Views", "River Access", "Cultural Exchange"],
    category: "Tent Camp",
    hostName: "Tjipuka Tjivikua",
    hostPhone: "+264810000006",
    available: true,
  },
  {
    _id: "demo-stay-5",
    title: "Kalahari Goat Station",
    type: "stay",
    region: "Southern",
    price: 55000,
    description:
      "Working goat station on the edge of the Kalahari. Participate in seasonal herding across red dune landscapes. Stone kraal accommodations with traditional braai facilities.",
    image: "/images/stay-goat-station.png",
    features: ["Goat Herding", "Red Dunes", "Traditional Braai"],
    category: "Working Farm",
    hostName: "Frikkie Boois",
    hostPhone: "+264810000004",
    available: true,
  },
  {
    _id: "demo-stay-6",
    title: "Caprivi Wetlands Lodge",
    type: "stay",
    region: "Zambezi",
    price: 110000,
    description:
      "Stilted timber cabins above the Caprivi floodplains. Unparalleled access to river delta ecosystems. Guided mokoro excursions and birding treks included in seasonal packages.",
    image: "/images/stay-wetlands-lodge.png",
    features: ["River Delta", "Mokoro Excursions", "Bird Watching"],
    category: "Eco Lodge",
    hostName: "Muyunda Likoro",
    hostPhone: "+264810000007",
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
  {
    _id: "demo-equip-4",
    title: "Borehole Drilling Rig",
    type: "equipment",
    region: "Kunene Region",
    price: 280000,
    description:
      "Truck-mounted rotary drilling rig capable of 200m borehole depth. Includes mud pump and casing equipment. Operator with 12 years experience available at additional cost. Minimum 3-day rental period.",
    image: "/images/equip-drilling-rig.png",
    features: ["200m Depth", "Mud Pump Included", "Operator Available"],
    category: "Heavy Machinery",
    hostName: "Hannes van Wyk",
    hostPhone: "+264810000008",
    available: true,
  },
  {
    _id: "demo-equip-5",
    title: "5kW Solar Panel Array",
    type: "equipment",
    region: "Erongo Region",
    price: 65000,
    description:
      "Complete off-grid photovoltaic system. 16 mono-crystalline panels, inverter, and battery bank. Portable mounting frames for seasonal relocation. Ideal for remote farm operations.",
    image: "/images/equip-solar-array.png",
    features: ["5kW Output", "Battery Bank", "Portable Frames"],
    category: "Energy",
    hostName: "Anna //Khaoes",
    hostPhone: "+264810000002",
    available: true,
  },
  {
    _id: "demo-equip-6",
    title: "Crop Harvesting Unit",
    type: "equipment",
    region: "Otjozondjupa",
    price: 200000,
    description:
      "Full-size agricultural harvesting unit suitable for wheat, maize, and sunflower crops. GPS-guided auto-steer with yield mapping. Requires 150HP minimum tractor for transport. Seasonal availability only.",
    image: "/images/equip-combine.png",
    features: ["GPS Auto-Steer", "Yield Mapping", "Multi-Crop"],
    category: "Machinery",
    hostName: "Johan Deetlefs",
    hostPhone: "+264810000001",
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

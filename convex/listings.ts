import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ─── Queries (Real-time subscriptions) ───────────────────────────

// Get all listings by type — powers the marketplace toggle
export const getByType = query({
  args: { type: v.union(v.literal("stay"), v.literal("equipment")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("listings")
      .withIndex("by_type_available", (q) =>
        q.eq("type", args.type).eq("available", true)
      )
      .collect();
  },
});

// Get a single listing by ID — powers the detail view
export const getById = query({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get all listings (admin/debug)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("listings").collect();
  },
});

// ─── Mutations ───────────────────────────────────────────────────

// Create a new listing
export const create = mutation({
  args: {
    title: v.string(),
    type: v.union(v.literal("stay"), v.literal("equipment")),
    region: v.string(),
    price: v.number(),
    description: v.string(),
    image: v.string(),
    features: v.array(v.string()),
    category: v.string(),
    hostName: v.string(),
    hostPhone: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("listings", {
      ...args,
      available: true,
    });
    return id;
  },
});

// Toggle listing availability
export const toggleAvailability = mutation({
  args: {
    id: v.id("listings"),
    available: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { available: args.available });
  },
});

// Seed the database with demo data
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("listings").first();
    if (existing) return { status: "already_seeded" };

    const listings = [
      {
        title: "Otjozondjupa Cattle Farm",
        type: "stay" as const,
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
        title: "Erongo Granite Lodge",
        type: "stay" as const,
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
        title: "Khomas Bush Walk",
        type: "stay" as const,
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
        title: "John Deere 5075E",
        type: "equipment" as const,
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
        title: "Industrial Water Pump",
        type: "equipment" as const,
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
        title: "Disc Harrow Implement",
        type: "equipment" as const,
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

    const ids = [];
    for (const listing of listings) {
      ids.push(await ctx.db.insert("listings", listing));
    }

    return { status: "seeded", count: ids.length };
  },
});

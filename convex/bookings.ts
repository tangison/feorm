import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ─── Queries (Real-time) ─────────────────────────────────────────

// Get bookings for a user — powers "My Journeys"
export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    // Enrich with listing data
    const enriched = await Promise.all(
      bookings.map(async (booking) => {
        const listing = await ctx.db.get(booking.listingId);
        return { ...booking, listing };
      })
    );

    return enriched;
  },
});

// Get a single booking by reference
export const getByReference = query({
  args: { reference: v.string() },
  handler: async (ctx, args) => {
    const booking = await ctx.db
      .query("bookings")
      .withIndex("by_reference", (q) => q.eq("reference", args.reference))
      .first();
    if (!booking) return null;
    const listing = await ctx.db.get(booking.listingId);
    return { ...booking, listing };
  },
});

// ─── Mutations ───────────────────────────────────────────────────

// Create a new booking
export const create = mutation({
  args: {
    listingId: v.id("listings"),
    userId: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    totalPrice: v.number(),
    escrowAmount: v.number(),
    serviceFee: v.number(),
    withOperator: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Generate reference: FE-{timestamp_base36}-{random}
    const ref = `FE-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    const id = await ctx.db.insert("bookings", {
      ...args,
      status: "pending",
      reference: ref,
    });

    return { bookingId: id, reference: ref };
  },
});

// Update booking status
export const updateStatus = mutation({
  args: {
    id: v.id("bookings"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

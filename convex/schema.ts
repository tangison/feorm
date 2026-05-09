import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  listings: defineTable({
    title: v.string(),
    type: v.union(v.literal("stay"), v.literal("equipment")),
    region: v.string(),
    price: v.number(), // Price in NAD cents
    description: v.string(),
    image: v.string(),
    features: v.array(v.string()),
    category: v.string(),
    hostName: v.string(),
    hostPhone: v.string(),
    available: v.boolean(),
  })
    .index("by_type", ["type"])
    .index("by_type_available", ["type", "available"]),

  bookings: defineTable({
    listingId: v.id("listings"),
    userId: v.string(), // Phone number as ID
    startDate: v.string(),
    endDate: v.string(),
    totalPrice: v.number(),
    escrowAmount: v.number(),
    serviceFee: v.number(),
    status: v.string(), // pending | confirmed | active | completed | cancelled
    reference: v.string(),
    withOperator: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_listing", ["listingId"])
    .index("by_reference", ["reference"]),

  users: defineTable({
    phone: v.string(),
    name: v.optional(v.string()),
    surname: v.optional(v.string()),
    region: v.optional(v.string()),
    role: v.string(), // explorer | lister
    verified: v.boolean(),
  })
    .index("by_phone", ["phone"]),
});

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const DEMO_OTP = "123456";

// ─── Queries ─────────────────────────────────────────────────────

// Get user by phone
export const getByPhone = query({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_phone", (q) => q.eq("phone", args.phone))
      .first();
  },
});

// ─── Mutations ───────────────────────────────────────────────────

// Request OTP (Demo: always succeeds, returns hint)
export const requestOtp = mutation({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    // Find or create user
    let user = await ctx.db
      .query("users")
      .withIndex("by_phone", (q) => q.eq("phone", args.phone))
      .first();

    if (!user) {
      const id = await ctx.db.insert("users", {
        phone: args.phone,
        role: "explorer",
        verified: false,
      });
      user = await ctx.db.get(id);
    }

    return {
      success: true,
      message: "OTP sent (Demo: use 123456)",
      userId: user!._id,
      isNewUser: !user!.name,
    };
  },
});

// Verify OTP (Demo: accepts 123456)
export const verifyOtp = mutation({
  args: { phone: v.string(), otp: v.string() },
  handler: async (ctx, args) => {
    if (args.otp !== DEMO_OTP) {
      throw new Error("Invalid OTP. Demo mode: use 123456");
    }

    let user = await ctx.db
      .query("users")
      .withIndex("by_phone", (q) => q.eq("phone", args.phone))
      .first();

    if (!user) {
      const id = await ctx.db.insert("users", {
        phone: args.phone,
        role: "explorer",
        verified: false,
      });
      user = await ctx.db.get(id);
    }

    return {
      success: true,
      userId: user!._id,
      isNewUser: !user!.name,
      phone: user!.phone,
    };
  },
});

// Setup user identity
export const setupIdentity = mutation({
  args: {
    phone: v.string(),
    name: v.string(),
    surname: v.string(),
    region: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_phone", (q) => q.eq("phone", args.phone))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      name: args.name,
      surname: args.surname,
      region: args.region,
      role: args.role,
    });

    return { success: true };
  },
});

// Verify user
export const verifyUser = mutation({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_phone", (q) => q.eq("phone", args.phone))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, { verified: true });
    return { success: true };
  },
});

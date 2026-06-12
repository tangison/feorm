/**
 * Supabase Server Client — Demo Mode
 *
 * This file is kept as a stub so that any remaining imports
 * do not cause build errors. It does NOT connect to Supabase.
 */

export const createClient = async () => {
  return {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      getUser: async () => ({ data: { user: null } }),
      signInWithOtp: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
      exchangeCodeForSession: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: (_table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          maybeSingle: async () => ({ data: null, error: null }),
          order: () => ({
            data: [],
            error: null,
          }),
        }),
        order: () => ({
          data: [],
          error: null,
        }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
      }),
      upsert: () => ({ error: null }),
    }),
  };
};

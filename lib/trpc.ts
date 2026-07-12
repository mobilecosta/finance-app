/**
 * Legacy tRPC helper removed during the Supabase-only migration.
 * Keep this module so older imports fail loudly instead of bundling server code.
 */
export const trpc = {
  Provider: () => {
    throw new Error("tRPC has been removed. Use Supabase-backed data access instead.");
  },
};

export function createTRPCClient() {
  throw new Error("tRPC has been removed. Use Supabase-backed data access instead.");
}

import { createClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv, isServiceRoleConfigured } from "@/lib/env";

/**
 * Server-only Supabase client with service role privileges.
 * NEVER import this in client components.
 */
export function createServiceClient() {
  if (!isServiceRoleConfigured() || !publicEnv.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error(
      "Supabase service role is not configured. Set SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

export function createServiceClientSafe() {
  if (!isServiceRoleConfigured() || !publicEnv.NEXT_PUBLIC_SUPABASE_URL) {
    return null;
  }

  return createServiceClient();
}

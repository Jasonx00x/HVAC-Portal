import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdminEnv } from "@/lib/supabase/env";

export function createAdminClient() {
  const { url, serviceRoleKey } = getSupabaseAdminEnv();

  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

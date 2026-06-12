"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseCookieOptions, getSupabasePublicEnv } from "@/lib/supabase/env";

export function createClient() {
  const { url, anonKey } = getSupabasePublicEnv();

  if (!url || !anonKey) {
    throw new Error("Supabase URL and anon key are required.");
  }

  return createBrowserClient(url, anonKey, {
    cookieEncoding: "raw",
    cookieOptions: getSupabaseCookieOptions(),
    cookies: {
      encode: "tokens-only"
    }
  });
}

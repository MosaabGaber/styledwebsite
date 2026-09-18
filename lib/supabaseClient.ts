import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

// Custom fetch to prevent Next.js data caching while preserving all Supabase headers (apikey, Authorization, etc.)
const noCacheFetch = (url: RequestInfo | URL, options?: RequestInit) => {
  const headers = new Headers(options?.headers);
  headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
  headers.set("Pragma", "no-cache");

  return fetch(url, {
    ...options,
    cache: "no-store",
    headers,
  });
};

let singletonClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (singletonClient) return singletonClient;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key is missing. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in environment variables.");
    return null;
  }

  try {
    singletonClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: noCacheFetch,
      },
    });
    return singletonClient;
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    return null;
  }
}

// Export singleton instance reference for direct import usage
export const supabase = getSupabaseClient();

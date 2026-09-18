import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://jhkdvefkgrofpvgiovxf.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

// Custom fetch to prevent Next.js data cache from caching Supabase REST API calls
const noCacheFetch = (url: RequestInfo | URL, options?: RequestInit) => {
  return fetch(url, {
    ...options,
    cache: "no-store",
    headers: {
      ...options?.headers,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
    },
  });
};

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key is missing. Skipping client initialization.");
    return null;
  }
  try {
    cachedClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: noCacheFetch,
      },
    });
    return cachedClient;
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    return null;
  }
}

// Export safe supabase instance with no-cache fetch
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? (() => {
      try {
        return createClient(supabaseUrl, supabaseAnonKey, {
          global: {
            fetch: noCacheFetch,
          },
        });
      } catch (e) {
        console.error("Error creating Supabase client:", e);
        return null;
      }
    })()
  : null;

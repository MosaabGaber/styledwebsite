import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://jhkdvefkgrofpvgiovxf.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key is missing. Skipping client initialization.");
    return null;
  }
  try {
    cachedClient = createClient(supabaseUrl, supabaseAnonKey);
    return cachedClient;
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    return null;
  }
}

// Export safe supabase instance
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? (() => {
      try {
        return createClient(supabaseUrl, supabaseAnonKey);
      } catch (e) {
        console.error("Error creating Supabase client:", e);
        return null;
      }
    })()
  : null;

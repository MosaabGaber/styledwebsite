import { useState, useEffect } from "react";
import { getSupabaseClient, supabase } from "./supabaseClient";

/**
 * Custom hook to fetch total stock across all sizes for all products in a single batched query.
 * Returns a map of product_id -> total stock (sum of all sizes).
 * If Supabase fetch fails, returns an empty map so products fall back to default availability.
 */
export function useAllProductsStock() {
  const [stockMap, setStockMap] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchAllStock() {
      try {
        const client = getSupabaseClient() || supabase;
        if (!client) {
          console.warn("[DEBUG useAllProductsStock] Supabase client is unavailable.");
          return;
        }

        console.log("[DEBUG useAllProductsStock] Initiating Supabase inventory query for all products...");
        const { data, error } = await client
          .from("inventory")
          .select("product_id, stock");

        if (error) {
          console.error("[DEBUG useAllProductsStock] Supabase query returned error:", error.message || error, error);
          return;
        }

        console.log("[DEBUG useAllProductsStock] Raw inventory query result:", data);

        if (data && data.length > 0) {
          const map: Record<string, number> = {};
          data.forEach((row: { product_id: string; stock: number }) => {
            const current = map[row.product_id] ?? 0;
            map[row.product_id] = current + Math.max(0, row.stock);
          });
          console.log("[DEBUG useAllProductsStock] Computed total stock map per product:", map);
          setStockMap(map);
        } else {
          console.warn("[DEBUG useAllProductsStock] Returned empty array from inventory table.");
        }
      } catch (err: any) {
        console.error(
          "[DEBUG useAllProductsStock] Exception caught fetching inventory stock:",
          err?.message || err,
          err?.stack || err
        );
      }
    }

    fetchAllStock();
  }, []);

  return stockMap;
}

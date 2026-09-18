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
        if (!client) return;

        const { data, error } = await client
          .from("inventory")
          .select("product_id, stock");

        if (error) {
          console.error("Error fetching all inventory stock from Supabase:", error.message || error, error);
          return;
        }

        if (data && data.length > 0) {
          const map: Record<string, number> = {};
          data.forEach((row: { product_id: string; stock: number }) => {
            const current = map[row.product_id] ?? 0;
            map[row.product_id] = current + Math.max(0, row.stock);
          });
          setStockMap(map);
        }
      } catch (err: any) {
        console.error(
          "Exception caught fetching all inventory stock (falling back to default availability):",
          err?.message || err,
          err?.stack || err
        );
      }
    }

    fetchAllStock();
  }, []);

  return stockMap;
}

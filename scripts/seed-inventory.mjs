import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { products } from "../lib/products.ts"; // Or read dynamically

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim();
        process.env[key] = value;
      }
    }
  });
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding inventory table...");

  const defaultSizes = [38, 39, 40, 41, 42, 43, 44, 45, 46];
  const rows = [];

  for (const product of products) {
    const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : defaultSizes;
    for (const size of sizes) {
      rows.push({
        product_id: product.id,
        size: Number(size),
        stock: 10,
      });
    }
  }

  const { data, error } = await supabase
    .from("inventory")
    .upsert(rows, { onConflict: "product_id,size", ignoreDuplicates: true });

  if (error) {
    console.error("Error seeding inventory:", error);
  } else {
    console.log(`Successfully seeded ${rows.length} product/size inventory records!`);
  }
}

seed();

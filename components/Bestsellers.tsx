"use client";

import { products } from "@/lib/products";
import ProductCard from "./ProductCard";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAllProductsStock } from "@/lib/useInventory";

function BestsellersContent() {
  const stockMap = useAllProductsStock();
  const searchParams = useSearchParams();
  const router = useRouter();
  const genderParam = searchParams.get("gender");

  const [selectedGender, setSelectedGender] = useState<"all" | "men" | "women">("all");

  useEffect(() => {
    if (genderParam === "men" || genderParam === "women" || genderParam === "all") {
      setSelectedGender(genderParam);
    } else {
      setSelectedGender("all");
    }
  }, [genderParam]);

  const handleGenderChange = (gender: "all" | "men" | "women") => {
    setSelectedGender(gender);
    const params = new URLSearchParams(searchParams.toString());
    if (gender === "all") {
      params.delete("gender");
    } else {
      params.set("gender", gender);
    }
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}#bestsellers` : "/#bestsellers", { scroll: false });
  };

  const bestsellers = products.filter((p) => {
    if (!p.isBestseller) return false;
    if (selectedGender === "all") return true;
    return p.gender === selectedGender;
  });

  return (
    <section id="bestsellers" className="pt-8 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <h2 className="font-display font-black text-4xl text-gray-900 tracking-tight">
              BESTSELLERS
            </h2>
            <p className="text-gray-500 mt-2">Our most loved styles.</p>
          </div>

          {/* Men / Women / All Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-full border border-gray-200">
            {(["all", "men", "women"] as const).map((gender) => (
              <button
                key={gender}
                onClick={() => handleGenderChange(gender)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedGender === gender
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
                }`}
              >
                {gender === "all" ? "All" : gender === "men" ? "Men" : "Women"}
              </button>
            ))}
          </div>
        </div>

        {bestsellers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {bestsellers.map((product) => {
              const isSoldOut = Boolean(product.soldOut) || (stockMap[product.id] !== undefined && stockMap[product.id] <= 0);
              return <ProductCard key={product.id} product={product} isSoldOut={isSoldOut} />;
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No products found for this category.
          </div>
        )}
      </div>
    </section>
  );
}

export default function Bestsellers() {
  return (
    <Suspense
      fallback={
        <section id="bestsellers" className="pt-8 pb-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-12 bg-gray-100 animate-pulse rounded-lg mb-8" />
          </div>
        </section>
      }
    >
      <BestsellersContent />
    </Suspense>
  );
}

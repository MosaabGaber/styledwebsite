"use client";

import { products } from "@/lib/products";
import ProductCard from "./ProductCard";
import HeroSlider, { accessoriesSlides } from "./HeroSlider";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAllProductsStock } from "@/lib/useInventory";

type TabType = "all" | "men" | "women" | "accessories";

function BestsellersContent() {
  const stockMap = useAllProductsStock();
  const searchParams = useSearchParams();
  const router = useRouter();
  const genderParam = searchParams.get("gender");
  const categoryParam = searchParams.get("category");
  const tabParam = searchParams.get("tab");

  const [selectedTab, setSelectedTab] = useState<TabType>("all");

  useEffect(() => {
    const raw = (tabParam || categoryParam || genderParam)?.toLowerCase();
    if (raw === "accessories") {
      setSelectedTab("accessories");
    } else if (raw === "men" || raw === "women" || raw === "all") {
      setSelectedTab(raw);
    } else {
      setSelectedTab("all");
    }
  }, [genderParam, categoryParam, tabParam]);

  const handleTabChange = (tab: TabType) => {
    setSelectedTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "all") {
      params.delete("gender");
      params.delete("category");
      params.delete("tab");
    } else {
      params.delete("category");
      params.delete("tab");
      params.set("gender", tab);
    }
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}#bestsellers` : "/#bestsellers", { scroll: false });
  };

  const displayedProducts = products.filter((p) => {
    if (selectedTab === "accessories") {
      return p.category === "accessories";
    }
    // Men and Women should show only category: "shoes" products
    if (p.category !== "shoes") return false;
    if (!p.isBestseller) return false;
    if (selectedTab === "all") return true;
    return p.gender === selectedTab;
  });

  return (
    <section id="bestsellers" className="pt-8 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h2 className="font-display font-black text-4xl text-gray-900 tracking-tight">
              {selectedTab === "accessories" ? "ACCESSORIES" : "BESTSELLERS"}
            </h2>
            <p className="text-gray-500 mt-2">
              {selectedTab === "accessories"
                ? "Elevate your tech with premium straps & bands."
                : "Our most loved styles."}
            </p>
          </div>

          {/* Men / Women / Accessories / All Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 p-1.5 rounded-full border border-gray-200">
            {(["all", "men", "women", "accessories"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedTab === tab
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
                }`}
              >
                {tab === "all"
                  ? "All"
                  : tab === "men"
                  ? "Men"
                  : tab === "women"
                  ? "Women"
                  : "Accessories"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accessories Hero Slider: edge-to-edge, half-screen (50vh), directly above grid with no gap */}
      {selectedTab === "accessories" && (
        <div className="w-full mb-8">
          <HeroSlider slides={accessoriesSlides} showNavLabels={false} />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {displayedProducts.map((product) => {
              const isSoldOut =
                Boolean(product.soldOut) ||
                (stockMap[product.id] !== undefined && stockMap[product.id] <= 0);
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

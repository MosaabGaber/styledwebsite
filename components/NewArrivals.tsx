"use client";

import { products } from "@/lib/products";
import ProductCard from "./ProductCard";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function NewArrivals() {
  const newArrivals = products.filter(p => p.isNewArrival);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === "left" ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (newArrivals.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-display font-black text-4xl text-gray-900 tracking-tight">
              NEW ARRIVALS
            </h2>
            <p className="text-gray-500 mt-2">Fresh styles just landed.</p>
          </div>
          
          <div className="hidden sm:flex gap-2">
            <button 
              onClick={() => scroll("left")}
              className="p-3 rounded-full bg-white border border-gray-200 text-gray-900 hover:border-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="p-3 rounded-full bg-white border border-gray-200 text-gray-900 hover:border-gray-900 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Horizontal scrollable container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {newArrivals.map((product) => (
            <div key={product.id} className="min-w-[85vw] sm:min-w-[400px] lg:min-w-[350px] snap-start flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

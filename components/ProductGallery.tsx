"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync scroll position of mobile carousel when activeIndex changes
  // (but only if it wasn't triggered by a scroll event to avoid feedback fighting)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && !isScrollingRef.current) {
      const width = container.clientWidth;
      container.scrollTo({
        left: activeIndex * width,
        behavior: "smooth"
      });
    }
  }, [activeIndex]);

  // Handle mobile horizontal scroll snapping to update activeIndex
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    isScrollingRef.current = true;
    
    // Clear any pending scroll timeouts
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    
    if (width > 0) {
      const index = Math.round(scrollLeft / width);
      if (index >= 0 && index < images.length && index !== activeIndex) {
        setActiveIndex(index);
      }
    }
    
    // Reset scrolling flag after scrolling has finished (150ms idle)
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 150);
  };

  // Cleanup scroll timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Main Image Display (Desktop and Mobile) */}
      <div className="w-full relative">
        {/* Mobile Swipe Carousel (hidden on desktop) */}
        <div className="md:hidden w-full relative">
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar rounded-2xl bg-neutral-50 border border-gray-100"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {images.map((img, idx) => (
              <div key={idx} className="w-full flex-shrink-0 snap-center aspect-[4/5] relative">
                <Image 
                  src={img} 
                  alt={`${name} view ${idx + 1}`} 
                  fill 
                  className="object-contain" 
                  sizes="100vw"
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Main Display Image (hidden on mobile) */}
        <div className="hidden md:block w-full relative aspect-[4/5] bg-neutral-50 rounded-2xl overflow-hidden border border-gray-100">
          <Image
            key={activeIndex} // Forces React to unmount and mount a single Image node, preventing any stacking/opacity leaks
            src={images[activeIndex]}
            alt={name}
            fill
            className="object-contain md:object-cover"
            sizes="(max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      </div>

      {/* Horizontal Thumbnail Strip (Below the main image, for both mobile & desktop) */}
      {images.length > 1 && (
        <div className="w-full">
          <div className="flex gap-3 overflow-x-auto py-2 px-1 hide-scrollbar flex-nowrap justify-start md:justify-center">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  isScrollingRef.current = false; // Allow smooth scroll animation trigger
                  setActiveIndex(idx);
                }}
                className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl overflow-hidden border bg-neutral-50 transition-all ${
                  activeIndex === idx 
                    ? 'border-brand-green ring-2 ring-brand-green/30 scale-105' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <Image 
                  src={img} 
                  alt={`${name} thumbnail ${idx + 1}`} 
                  fill 
                  className="object-contain p-1" 
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

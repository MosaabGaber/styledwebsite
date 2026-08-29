"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle mobile horizontal scroll snapping to update dots
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    if (width > 0) {
      const index = Math.round(scrollLeft / width);
      if (index >= 0 && index < images.length && index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  };

  // Scroll to index on mobile when dot clicked
  const scrollToImage = (index: number) => {
    setActiveIndex(index);
    const container = scrollContainerRef.current;
    if (container) {
      const width = container.clientWidth;
      container.scrollTo({
        left: index * width,
        behavior: "smooth"
      });
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Mobile/Tablet Swipe Carousel (hidden on desktop) */}
      <div className="md:hidden w-full relative">
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar rounded-2xl bg-gray-50"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map((img, idx) => (
            <div key={idx} className="w-full flex-shrink-0 snap-center aspect-[4/5] relative">
              <Image 
                src={img} 
                alt={`${name} view ${idx + 1}`} 
                fill 
                className="object-cover" 
                sizes="100vw"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
        
        {/* Dot Indicators */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToImage(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? 'w-6 bg-brand-green' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop Gallery Layout (hidden on mobile) */}
      <div className="hidden md:flex flex-row gap-4 w-full">
        {/* Thumbnails list (side) */}
        {images.length > 1 && (
          <div className="flex flex-col gap-3 w-20 lg:w-24 flex-shrink-0 max-h-[500px] overflow-y-auto hide-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative aspect-[4/5] rounded-xl overflow-hidden border-2 bg-gray-50 transition-all flex-shrink-0 ${
                  activeIndex === idx 
                    ? 'border-brand-green ring-2 ring-brand-green/20' 
                    : 'border-transparent hover:border-gray-200'
                }`}
              >
                <Image 
                  src={img} 
                  alt={`${name} thumbnail ${idx + 1}`} 
                  fill 
                  className="object-cover" 
                  sizes="(max-width: 1024px) 80px, 96px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main Display Image */}
        <div className="flex-1 relative aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={images[activeIndex]}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 50vw, 33vw"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

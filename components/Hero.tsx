"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[70vh] min-h-[500px] w-full bg-gray-50 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=2487&auto=format&fit=crop"
          alt="Hero Sneaker"
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-display font-black text-7xl md:text-9xl text-gray-900 tracking-tighter mb-6 leading-[0.9]">
              STEP INTO <br />
              <span className="text-brand-green">STYLED.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-md">
              Minimal design, maximum comfort. Discover the new collection of premium sneakers crafted for the modern lifestyle.
            </p>
            
            <Link 
              href="#bestsellers" 
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white px-8 py-4 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

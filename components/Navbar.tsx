"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-display font-bold text-2xl tracking-tighter text-gray-900">
              STYLED.
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-brand-green font-medium transition-colors">Home</Link>
            <Link href="#" className="text-gray-600 hover:text-brand-green font-medium transition-colors">Men</Link>
            <Link href="#" className="text-gray-600 hover:text-brand-green font-medium transition-colors">Women</Link>
            <Link href="#" className="text-gray-600 hover:text-brand-green font-medium transition-colors">New Arrivals</Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/checkout" className="text-gray-900 hover:text-brand-green transition-colors relative">
              <ShoppingBag className="w-6 h-6" />
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 hover:text-brand-green transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <Link href="/" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md">Home</Link>
              <Link href="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md">Men</Link>
              <Link href="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md">Women</Link>
              <Link href="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md">New Arrivals</Link>
              <Link href="/checkout" className="block px-3 py-2 text-base font-medium text-brand-green flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5" />
                <span>Cart / Checkout</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

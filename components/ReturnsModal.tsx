"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCw, ShieldCheck } from "lucide-react";

interface ReturnsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReturnsModal({ isOpen, onClose }: ReturnsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-2xl z-10 border border-gray-100"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl text-gray-900">
                Returns & Exchange Policy
              </h3>
            </div>

            {/* Content */}
            <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                <div className="flex items-start gap-2 text-gray-900 font-semibold">
                  <ShieldCheck className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                  <span>Returns</span>
                </div>
                <p className="text-gray-600 text-sm pl-7">
                  Returns are accepted at the door only upon delivery.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                <div className="flex items-start gap-2 text-gray-900 font-semibold">
                  <RefreshCw className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                  <span>Exchanges</span>
                </div>
                <p className="text-gray-600 text-sm pl-7">
                  Exchanges are accepted within 2 days of receiving your order, and the item must be in good, unused condition.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={onClose}
              className="mt-8 w-full bg-brand-green hover:bg-brand-green-hover text-white py-3.5 rounded-full font-bold text-sm transition-all shadow-md"
            >
              Got it
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

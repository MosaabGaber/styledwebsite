"use client";

import { products } from "@/lib/products";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, RefreshCw, ShieldCheck, Truck } from "lucide-react";
import ProductGallery from "@/components/ProductGallery";
import ReturnsModal from "@/components/ReturnsModal";
import { getSupabaseClient, supabase } from "@/lib/supabaseClient";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const product = products.find((p) => p.id === id);

  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [isReturnsModalOpen, setIsReturnsModalOpen] = useState(false);
  const [stockMap, setStockMap] = useState<Record<number, number>>({});
  const [hasFetchedStock, setHasFetchedStock] = useState(false);

  const productId = product?.id;

  useEffect(() => {
    if (!productId) return;
    async function fetchStock() {
      try {
        const client = getSupabaseClient() || supabase;
        if (!client) {
          console.warn("Supabase client unavailable. Falling back to treating all sizes as in-stock.");
          return;
        }

        const { data, error } = await client
          .from("inventory")
          .select("size, stock")
          .eq("product_id", productId);

        if (error) {
          console.error("Error response fetching inventory stock from Supabase:", error.message || error);
          return;
        }

        if (data && data.length > 0) {
          const map: Record<number, number> = {};
          data.forEach((row: { size: number; stock: number }) => {
            map[row.size] = row.stock;
          });
          setStockMap(map);
          setHasFetchedStock(true);
        }
      } catch (err: any) {
        console.error(
          "Exception caught fetching inventory stock from Supabase:",
          err?.message || err
        );
      }
    }

    fetchStock();
  }, [productId]);

  useEffect(() => {
    if (selectedSize !== null && stockMap[selectedSize] !== undefined && stockMap[selectedSize] <= 0) {
      setSelectedSize(null);
    }
  }, [stockMap, selectedSize]);

  if (!product) {
    notFound();
  }

  const isAllSizesOutOfStock =
    hasFetchedStock &&
    product.sizes.length > 0 &&
    product.sizes.every((size) => stockMap[size] !== undefined && stockMap[size] <= 0);

  const isProductSoldOut = Boolean(product.soldOut) || isAllSizesOutOfStock;

  const isSelectedSizeOutOfStock =
    selectedSize !== null &&
    stockMap[selectedSize] !== undefined &&
    stockMap[selectedSize] <= 0;

  const isBuyDisabled =
    isProductSoldOut ||
    selectedSize === null ||
    isSelectedSizeOutOfStock;

  const handleBuyNow = () => {
    if (!selectedSize || isSelectedSizeOutOfStock || isProductSoldOut) {
      alert("Please select an available size");
      return;
    }
    
    // In a real app, use React Context/Redux or URL params to pass this state
    const checkoutParams = new URLSearchParams({
      productId: product.id,
      color: selectedColor?.name || "",
      size: selectedSize.toString(),
    });
    
    router.push(`/checkout?${checkoutParams.toString()}`);
  };

  return (
    <div className="bg-white min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-brand-green mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/2"
          >
            <ProductGallery images={product.images} name={product.name} />
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/2 flex flex-col justify-center"
          >
            <h1 className="font-display font-black text-4xl text-gray-900 mb-2">{product.name}</h1>
            <p className="text-2xl font-medium text-gray-900 mb-6">{product.price.toLocaleString()} EGP</p>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Colors */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Color</h3>
                <span className="text-sm text-gray-500">{selectedColor?.name}</span>
              </div>
              <div className="flex gap-4">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    disabled={isProductSoldOut}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedColor?.name === color.name ? 'border-brand-green scale-110' : 'border-gray-200'
                    } ${isProductSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={`Select ${color.name}`}
                  >
                    {selectedColor?.name === color.name && (
                      <Check className={`w-5 h-5 ${color.hex === '#FFFFFF' || color.hex.toLowerCase() === '#f0fdf4' ? 'text-gray-900' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Size (EU)</h3>
                <Link href="#" className="text-sm text-brand-green hover:underline">Size Guide</Link>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {product.sizes.map((size) => {
                  const isSizeOutOfStock = isProductSoldOut || (stockMap[size] !== undefined && stockMap[size] <= 0);
                  const isSelected = selectedSize === size;

                  return (
                    <button
                      key={size}
                      disabled={isSizeOutOfStock}
                      onClick={() => !isSizeOutOfStock && setSelectedSize(size)}
                      title={isSizeOutOfStock ? "Out of stock" : `Size ${size}`}
                      className={`relative py-3 rounded-xl border font-medium transition-all ${
                        isSizeOutOfStock
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed line-through opacity-60'
                          : isSelected 
                            ? 'bg-brand-green border-brand-green text-white' 
                            : 'bg-white border-gray-200 text-gray-900 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {isProductSoldOut ? (
              <button 
                disabled
                className="w-full bg-gray-200 text-gray-400 py-5 rounded-full font-bold text-lg cursor-not-allowed mb-4"
              >
                Sold Out
              </button>
            ) : (
              <button 
                disabled={isBuyDisabled}
                onClick={handleBuyNow}
                className={`w-full py-5 rounded-full font-bold text-lg transition-transform transform mb-4 ${
                  isBuyDisabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-brand-green hover:bg-brand-green-hover text-white hover:scale-[1.02] shadow-lg"
                }`}
              >
                {selectedSize === null ? "Select a Size" : isSelectedSizeOutOfStock ? "Out of Stock" : "Buy Now"}
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsReturnsModalOpen(true)}
              className="w-full text-center text-sm font-semibold text-gray-500 hover:text-brand-green transition-colors mb-6 flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4 text-brand-green" />
              <span>Returns & Exchange Policy</span>
            </button>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-brand-green">
                  <Truck className="w-5 h-5" />
                </div>
                <span>Free shipping over 150 EGP</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-brand-green">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span>Secure Checkout</span>
              </div>
            </div>
            
          </motion.div>
        </div>
      </div>

      <ReturnsModal
        isOpen={isReturnsModalOpen}
        onClose={() => setIsReturnsModalOpen(false)}
      />
    </div>
  );
}

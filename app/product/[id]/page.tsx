"use client";

import { products } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ShieldCheck, Truck } from "lucide-react";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const product = products.find((p) => p.id === id);

  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    notFound();
  }

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert("Please select a size");
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
            className="lg:w-1/2 flex flex-col-reverse sm:flex-row gap-4"
          >
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-4 overflow-x-auto sm:overflow-y-auto sm:w-24 flex-shrink-0 hide-scrollbar">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-brand-green' : 'border-transparent hover:border-gray-200'}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="relative aspect-[4/5] sm:aspect-auto sm:flex-1 bg-gray-50 rounded-2xl overflow-hidden">
              <Image 
                src={product.images[activeImage]} 
                alt={product.name} 
                fill 
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/2 flex flex-col justify-center"
          >
            <h1 className="font-display font-black text-4xl text-gray-900 mb-2">{product.name}</h1>
            <p className="text-2xl font-medium text-gray-900 mb-6">${product.price}</p>
            
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
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedColor?.name === color.name ? 'border-brand-green scale-110' : 'border-gray-200'
                    }`}
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
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-xl border font-medium transition-all ${
                      selectedSize === size 
                        ? 'bg-brand-green border-brand-green text-white' 
                        : 'bg-white border-gray-200 text-gray-900 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleBuyNow}
              className="w-full bg-brand-green hover:bg-brand-green-hover text-white py-5 rounded-full font-bold text-lg transition-transform transform hover:scale-[1.02] shadow-lg mb-6"
            >
              Buy Now
            </button>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-brand-green">
                  <Truck className="w-5 h-5" />
                </div>
                <span>Free shipping over $150</span>
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
    </div>
  );
}

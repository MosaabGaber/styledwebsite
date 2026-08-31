"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { products } from "@/lib/products";
import Image from "next/image";
import { CheckCircle2, ChevronLeft, CreditCard, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const productId = searchParams.get("productId");
  const colorName = searchParams.get("color");
  const size = searchParams.get("size");

  const product = products.find((p) => p.id === productId);

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "INSTAPAY">("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    instapayRef: "",
  });

  if (!product) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">No product selected</h2>
        <Link href="/" className="text-brand-green hover:underline">Return to Home</Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const orderTotal = product.price >= 150 ? product.price : product.price + 10;
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          productName: product.name,
          size: size,
          color: colorName,
          price: orderTotal,
          paymentMethod: paymentMethod,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setIsSuccess(true);
      } else {
        alert(data.message || "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Checkout submission error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto py-24 px-4 text-center"
      >
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="font-display font-black text-4xl text-gray-900 mb-4">ORDER CONFIRMED</h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you, {formData.name}! Your order for {product.name} has been received. 
          {paymentMethod === "COD" ? " You will pay on delivery." : " We are verifying your InstaPay transfer."}
        </p>
        <Link href="/" className="inline-block bg-brand-green text-white px-8 py-4 rounded-full font-bold hover:bg-brand-green-hover transition-colors">
          Continue Shopping
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => router.back()} className="inline-flex items-center text-gray-500 hover:text-brand-green mb-8">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Col - Forms */}
        <div className="lg:w-3/5">
          <h2 className="font-display font-bold text-2xl mb-8">CHECKOUT</h2>
          
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
            {/* Customer Details */}
            <section>
              <h3 className="text-lg font-bold border-b border-gray-100 pb-2 mb-6">Customer Details</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input required type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input required type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all" />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select
                    required
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all bg-white"
                  >
                    <option value="">Select a city</option>
                    <option value="Cairo">Cairo</option>
                    <option value="Giza">Giza</option>
                    <option value="Alexandria">Alexandria</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                  <textarea required id="address" name="address" rows={3} value={formData.address} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all resize-none"></textarea>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h3 className="text-lg font-bold border-b border-gray-100 pb-2 mb-6">Payment Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === 'COD' ? 'border-brand-green bg-brand-green/5' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <Wallet className={`w-6 h-6 ${paymentMethod === 'COD' ? 'text-brand-green' : 'text-gray-400'}`} />
                  <div>
                    <span className="block font-bold text-gray-900">Cash on Delivery</span>
                    <span className="block text-sm text-gray-500">Pay when you receive</span>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod("INSTAPAY")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === 'INSTAPAY' ? 'border-brand-green bg-brand-green/5' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <CreditCard className={`w-6 h-6 ${paymentMethod === 'INSTAPAY' ? 'text-brand-green' : 'text-gray-400'}`} />
                  <div>
                    <span className="block font-bold text-gray-900">InstaPay</span>
                    <span className="block text-sm text-gray-500">Direct transfer</span>
                  </div>
                </button>
              </div>

              <AnimatePresence>
                {paymentMethod === "INSTAPAY" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
                      <p className="text-sm text-gray-600">
                        Please transfer the total amount to our InstaPay handle: <br/>
                        <strong className="text-brand-green text-lg">styled_store@instapay</strong>
                      </p>
                      <div>
                        <label htmlFor="instapayRef" className="block text-sm font-medium text-gray-700 mb-1">Transaction Reference / Sender Name</label>
                        <input required={paymentMethod === "INSTAPAY"} type="text" id="instapayRef" name="instapayRef" value={formData.instapayRef} onChange={handleInputChange} placeholder="e.g. 123456789 or John Doe" className="w-full border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </form>
        </div>

        {/* Right Col - Order Summary */}
        <div className="lg:w-2/5">
          <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 sticky top-28">
            <h3 className="font-bold text-xl mb-6">Order Summary</h3>
            
            <div className="flex gap-4 border-b border-gray-200 pb-6 mb-6">
              <div className="w-24 h-24 bg-white rounded-lg overflow-hidden relative flex-shrink-0 border border-gray-100">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h4 className="font-bold text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-500 mb-1">Color: {colorName} | Size: {size}</p>
                <p className="font-medium text-gray-900">${product.price}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${product.price}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{product.price >= 150 ? "Free" : "$10"}</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-200 pt-6 mb-8">
              <span className="font-bold text-lg text-gray-900">Total</span>
              <span className="font-bold text-2xl text-gray-900">
                ${product.price >= 150 ? product.price : product.price + 10}
              </span>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full bg-brand-green hover:bg-brand-green-hover text-white py-5 rounded-xl font-bold text-lg transition-transform transform hover:scale-[1.02] shadow-lg disabled:opacity-70 flex justify-center items-center"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Confirm Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading checkout...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}

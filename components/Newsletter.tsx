"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      // Simulate API call
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-24 bg-brand-green text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display font-black text-4xl tracking-tight mb-4">
          JOIN THE CLUB
        </h2>
        <p className="text-white/80 mb-10 max-w-xl mx-auto text-lg">
          Subscribe to get early access to new drops, exclusive sales, and community events.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-full py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-white text-brand-green rounded-full w-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Subscribe"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
        
        {subscribed && (
          <p className="mt-4 text-sm text-white font-medium animate-pulse">
            Thanks for subscribing! Check your inbox soon.
          </p>
        )}
      </div>
    </section>
  );
}

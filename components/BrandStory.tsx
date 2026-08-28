import Image from "next/image";
import Link from "next/link";

export default function BrandStory() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="font-display font-black text-4xl text-gray-900 tracking-tight mb-6">
              DESIGNED FOR THE <br /> MODERN MOVEMENT.
            </h2>
            <div className="space-y-6 text-gray-600 text-lg">
              <p>
                At STYLED, we believe that you shouldn't have to choose between aesthetic and comfort. Our sneakers are crafted with premium materials and a minimalist philosophy, ensuring they look as good as they feel.
              </p>
              <p>
                From the bustling city streets to the quiet studio, our footwear adapts to your environment. We're committed to sustainable practices and timeless design, creating shoes that you'll wear season after season.
              </p>
            </div>
            <Link 
              href="#" 
              className="inline-block mt-10 border-b-2 border-gray-900 pb-1 font-bold text-gray-900 hover:text-brand-green hover:border-brand-green transition-colors"
            >
              Read Our Full Story
            </Link>
          </div>
          
          <div className="lg:w-1/2 w-full relative">
            <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=2487&auto=format&fit=crop"
                alt="Styled Lifestyle"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-brand-green rounded-full -z-10 blur-3xl opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

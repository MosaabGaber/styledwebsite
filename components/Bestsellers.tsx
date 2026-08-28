import { products } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function Bestsellers() {
  const bestsellers = products.filter(p => p.isBestseller);

  return (
    <section id="bestsellers" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-display font-black text-4xl text-gray-900 tracking-tight">
              BESTSELLERS
            </h2>
            <p className="text-gray-500 mt-2">Our most loved styles.</p>
          </div>
          <a href="#" className="hidden sm:block text-brand-green font-medium hover:underline">
            Shop All Bestsellers
          </a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-10 sm:hidden">
          <a href="#" className="block w-full text-center border border-gray-200 rounded-full py-3 font-medium text-gray-900 hover:border-gray-900 transition-colors">
            Shop All Bestsellers
          </a>
        </div>
      </div>
    </section>
  );
}

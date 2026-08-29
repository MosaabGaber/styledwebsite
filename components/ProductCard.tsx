import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 group-hover:scale-105 ${product.soldOut ? 'opacity-40 grayscale' : ''}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {/* Secondary image on hover (optional enhancement) */}
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            fill
            className={`object-cover transition-opacity duration-700 opacity-0 group-hover:opacity-100 absolute inset-0 ${product.soldOut ? 'opacity-40 grayscale' : ''}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        )}
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNewArrival && (
            <span className="bg-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-gray-900 shadow-sm">
              New
            </span>
          )}
          {product.soldOut && (
            <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Sold Out
            </span>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">{product.name}</h3>
          <p className="text-gray-500 text-sm">{product.colors.length} Colors</p>
        </div>
        <p className="font-medium text-gray-900">${product.price}</p>
      </div>
    </Link>
  );
}

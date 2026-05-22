'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCart, CartProduct } from '@/context/CartContext';

interface ProductCardProps {
  product: CartProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  // Simple formatter for local currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  return (
    <div className="group bg-white rounded-lg border border-brand-gray-medium overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sin Imagen
          </div>
        )}
        <span className="absolute top-2 right-2 text-xs font-semibold px-2.5 py-0.5 rounded bg-brand-dark text-white shadow-sm">
          {product.category || 'Varios'}
        </span>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/productos/${product.slug}`} className="hover:underline">
            <h3 className="text-base font-bold text-brand-dark line-clamp-1 mb-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
            {product.description || 'Sin descripción disponible.'}
          </p>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-lg font-bold text-brand-dark">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/productos/${product.slug}`}
              className="inline-flex items-center justify-center gap-1 rounded bg-brand-gray-light border border-brand-gray-medium text-brand-dark px-3 py-2 text-xs font-semibold hover:bg-gray-100 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              Ver
            </Link>
            <button
              onClick={() => addToCart(product, 1)}
              className="inline-flex items-center justify-center gap-1 rounded bg-brand-mint text-brand-dark px-3 py-2 text-xs font-semibold hover:bg-opacity-95 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

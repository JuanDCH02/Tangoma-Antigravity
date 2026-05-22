'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart, CartProduct } from '@/context/CartContext';

interface AddToCartSectionProps {
  product: CartProduct;
}

export default function AddToCartSection({ product }: AddToCartSectionProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {/* Quantity selector */}
        <div className="flex items-center border border-gray-300 rounded overflow-hidden h-11 bg-white">
          <button
            onClick={handleDecrement}
            className="px-3 h-full hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
            type="button"
          >
            <Minus className="h-4 w-4 text-gray-500" />
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-12 text-center focus:outline-none text-sm font-semibold h-full border-x border-gray-100"
          />
          <button
            onClick={handleIncrement}
            className="px-3 h-full hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
            type="button"
          >
            <Plus className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Add button */}
        <button
          onClick={handleAddToCart}
          className={`flex-1 h-11 rounded font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            added
              ? 'bg-brand-mint text-brand-dark shadow-sm'
              : 'bg-brand-dark text-white hover:bg-opacity-95 shadow-md active:scale-95'
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          {added ? '¡Agregado!' : 'Agregar a Cotización'}
        </button>
      </div>
    </div>
  );
}

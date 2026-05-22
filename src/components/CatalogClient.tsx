'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { CartProduct } from '@/context/CartContext';

interface CatalogClientProps {
  initialProducts: CartProduct[];
}

export default function CatalogClient({ initialProducts }: CatalogClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<CartProduct[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Categories list derived from initial products, fallback to predefined
  const categories = ['Todas', 'Correas', 'Mangueras', 'Acoples', 'Pisos de Goma'];

  // Read URL query parameter on mount/change
  useEffect(() => {
    const catParam = searchParams.get('categoria');
    if (catParam) {
      setSelectedCategory(catParam);
    } else {
      setSelectedCategory('Todas');
    }
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'Todas') {
      params.delete('categoria');
    } else {
      params.set('categoria', category);
    }
    router.push(`/productos?${params.toString()}`, { scroll: false });
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === 'Todas' ||
      product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="border-l-4 border-brand-dark pl-3">
        <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">
          Catálogo de Productos
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Buscá y seleccioná los productos industriales que necesitás cotizar
        </p>
      </div>

      {/* Controls: Search and Categories */}
      <div className="bg-white p-6 rounded-lg border border-brand-gray-medium shadow-sm space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción de producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-dark text-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Categories Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filtrar por Categoría
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded text-xs font-semibold transition-all border cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand-dark text-white border-brand-dark shadow-sm'
                    : 'bg-brand-gray-light text-gray-600 border-brand-gray-medium hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-brand-gray-medium py-16 text-center shadow-sm">
          <div className="max-w-xs mx-auto space-y-3">
            <p className="text-lg font-bold text-brand-dark">No se encontraron productos</p>
            <p className="text-sm text-gray-400">
              Probá modificando los filtros o el término de búsqueda.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                handleCategoryChange('Todas');
              }}
              className="inline-flex items-center justify-center rounded bg-brand-dark text-white px-4 py-2 text-xs font-semibold hover:bg-opacity-90"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

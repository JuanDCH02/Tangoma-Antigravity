import { Suspense } from 'react';
import { db } from '@/lib/db';
import CatalogClient from '@/components/CatalogClient';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProductosPage() {
  let products: any[] = [];

  try {
    const dbProducts = await db.product.findMany({
      orderBy: { name: 'asc' },
    });

    products = dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: Number(p.price),
      imageUrl: p.imageUrl,
      category: p.category,
    }));
  } catch (error) {
    console.error('Failed to fetch products for catalog page', error);
  }

  return (
    <Suspense fallback={<div className="text-center py-12 text-sm text-gray-500">Cargando catálogo...</div>}>
      <CatalogClient initialProducts={products} />
    </Suspense>
  );
}

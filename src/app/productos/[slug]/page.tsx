import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import AddToCartSection from '@/components/AddToCartSection';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const revalidate = 60; // Revalidate every 60 seconds

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let product = null;
  try {
    const dbProduct = await db.product.findUnique({
      where: { slug },
    });

    if (dbProduct) {
      product = {
        id: dbProduct.id,
        name: dbProduct.name,
        slug: dbProduct.slug,
        description: dbProduct.description,
        price: Number(dbProduct.price),
        imageUrl: dbProduct.imageUrl,
        category: dbProduct.category,
      };
    }
  } catch (error) {
    console.error('Error fetching product in detail page', error);
  }

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/productos"
          className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-brand-dark transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>
      </div>

      {/* Main product structure */}
      <div className="bg-white rounded-lg border border-brand-gray-medium overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
        {/* Product Image */}
        <div className="relative aspect-square md:aspect-auto md:h-[400px] w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Imagen no disponible
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                {product.category || 'Categoría no definida'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight mt-1">
                {product.name}
              </h1>
            </div>

            <div className="text-2xl font-bold text-brand-dark">
              {formatPrice(product.price)}
            </div>

            <hr className="border-brand-gray-medium" />

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                Descripción
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description || 'Este producto no cuenta con una descripción detallada por el momento. Podés solicitar más información técnica al enviar tu cotización.'}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2 className="h-4 w-4 text-brand-mint shrink-0" />
                <span>Stock permanente disponible</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2 className="h-4 w-4 text-brand-mint shrink-0" />
                <span>Garantía de calidad de fábrica</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2 className="h-4 w-4 text-brand-mint shrink-0" />
                <span>Asesoramiento de instalación sin cargo</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-brand-gray-medium">
            <AddToCartSection product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import { ShieldCheck, Truck, Clock, Wrench } from 'lucide-react';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Fetch featured products
  let featuredProducts: any[] = [];
  try {
    const dbProducts = await db.product.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
    });
    featuredProducts = dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: Number(p.price),
      imageUrl: p.imageUrl,
      category: p.category,
    }));
  } catch (error) {
    console.error('Failed to fetch featured products', error);
  }

  const categories = [
    {
      name: 'Correas',
      description: 'Correas dentadas, en V, de transmisión y especiales.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
      href: '/productos?categoria=Correas',
    },
    {
      name: 'Mangueras',
      description: 'Mangueras para aspiración, PVC cristales, y fluidos.',
      image: 'https://images.unsplash.com/photo-1585713181935-d5f622cc2415?auto=format&fit=crop&w=400&q=80',
      href: '/productos?categoria=Mangueras',
    },
    {
      name: 'Acoples',
      description: 'Acoples rápidos Kamlock, elásticos de goma y juntas.',
      image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=400&q=80',
      href: '/productos?categoria=Acoples',
    },
    {
      name: 'Pisos de Goma',
      description: 'Pisos de goma antideslizantes tipo moneda y lisos.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
      href: '/productos?categoria=Pisos%20de%20Goma',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-brand-dark text-white py-20 px-8 sm:px-12 lg:px-16 shadow-lg">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80"
            alt="Fondo industrial"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative max-w-3xl space-y-6">
          <span className="inline-flex items-center rounded-full bg-brand-blue/20 px-3 py-1 text-sm font-medium text-brand-blue ring-1 ring-inset ring-brand-blue/30">
            Más de 40 años de trayectoria
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Distribuidor de Productos Industriales de Caucho y Transmisión
          </h1>
          <p className="text-lg text-gray-300 max-w-xl">
            Abastecemos a fábricas, talleres y profesionales con correas, mangueras, acoples y pisos de la más alta calidad. Asesoramiento técnico personalizado.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/productos"
              className="inline-flex items-center justify-center rounded bg-brand-mint text-brand-dark px-6 py-3 font-semibold hover:bg-opacity-95 shadow-md active:scale-95 transition-all"
            >
              Ver Catálogo Completo
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center rounded bg-white/10 border border-white/20 text-white px-6 py-3 font-semibold hover:bg-white/20 transition-all"
            >
              Contactar Soporte
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-brand-gray-medium shadow-sm flex items-start gap-4">
          <ShieldCheck className="h-8 w-8 text-brand-mint shrink-0" />
          <div>
            <h3 className="font-bold text-brand-dark text-sm mb-1">Calidad Garantizada</h3>
            <p className="text-xs text-gray-500">Trabajamos únicamente con primeras marcas y materiales aprobados.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-brand-gray-medium shadow-sm flex items-start gap-4">
          <Wrench className="h-8 w-8 text-brand-mint shrink-0" />
          <div>
            <h3 className="font-bold text-brand-dark text-sm mb-1">Asesoramiento Técnico</h3>
            <p className="text-xs text-gray-500">Te ayudamos a elegir el producto exacto según tu requerimiento.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-brand-gray-medium shadow-sm flex items-start gap-4">
          <Truck className="h-8 w-8 text-brand-mint shrink-0" />
          <div>
            <h3 className="font-bold text-brand-dark text-sm mb-1">Envío a Todo el País</h3>
            <p className="text-xs text-gray-500">Coordinamos despachos de mercadería de manera rápida y segura.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-brand-gray-medium shadow-sm flex items-start gap-4">
          <Clock className="h-8 w-8 text-brand-mint shrink-0" />
          <div>
            <h3 className="font-bold text-brand-dark text-sm mb-1">Trayectoria y Confianza</h3>
            <p className="text-xs text-gray-500">Atendido por sus dueños, garantizando un servicio personalizado.</p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="space-y-6">
        <div className="border-l-4 border-brand-dark pl-3">
          <h2 className="text-2xl font-bold text-brand-dark">Categorías de Productos</h2>
          <p className="text-sm text-gray-500 mt-1">Explorá nuestras familias de productos más solicitadas</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative h-48 rounded-lg overflow-hidden border border-brand-gray-medium shadow-sm block hover:shadow-md transition-all duration-300"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300 brightness-[0.85]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent p-4 flex flex-col justify-end">
                <h3 className="font-bold text-white text-lg">{cat.name}</h3>
                <p className="text-xs text-gray-300 mt-1 leading-snug line-clamp-2">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-l-4 border-brand-dark pl-3">
            <div>
              <h2 className="text-2xl font-bold text-brand-dark">Últimos Ingresos</h2>
              <p className="text-sm text-gray-500 mt-1">Productos añadidos recientemente al catálogo</p>
            </div>
            <Link
              href="/productos"
              className="text-sm font-semibold text-brand-dark hover:text-brand-mint transition-colors"
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

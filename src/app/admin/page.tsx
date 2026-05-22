import { db } from '@/lib/db';
import AdminDashboard from '@/components/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  let products: any[] = [];
  let quotes: any[] = [];

  try {
    // 1. Fetch products
    const dbProducts = await db.product.findMany({
      orderBy: { createdAt: 'desc' },
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

    // 2. Fetch quote requests
    const dbQuotes = await db.quoteRequest.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    quotes = dbQuotes.map((q) => ({
      id: q.id,
      name: q.name,
      email: q.email,
      phone: q.phone,
      company: q.company,
      message: q.message,
      status: q.status,
      createdAt: q.createdAt.toISOString(),
      items: q.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: Number(item.price),
        product: {
          name: item.product.name,
          category: item.product.category,
        },
      })),
    }));
  } catch (error) {
    console.error('Failed to load data for Admin Dashboard', error);
  }

  return <AdminDashboard initialProducts={products} initialQuotes={quotes} />;
}

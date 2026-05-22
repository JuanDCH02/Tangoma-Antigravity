import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Helper to generate a slug
function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

// GET all products
export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { name: 'asc' },
    });

    const formattedProducts = products.map((p) => ({
      ...p,
      price: Number(p.price),
    }));

    return NextResponse.json(formattedProducts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create a product
export async function POST(request: Request) {
  try {
    const { name, description, price, imageUrl, category } = await request.json();

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: 'El nombre y el precio son obligatorios.' },
        { status: 400 }
      );
    }

    const slug = generateSlug(name) + '-' + Math.floor(Math.random() * 1000);

    const product = await db.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price.toString()),
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80', // default industrial image
        category: category || 'Otros',
      },
    });

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        price: Number(product.price),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al crear el producto.' },
      { status: 500 }
    );
  }
}

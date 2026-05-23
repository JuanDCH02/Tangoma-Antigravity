import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: PageProps) {
  try {
    const { id } = await params;
    const { name, category, price, description, imageUrl } = await request.json();

    if (!name || !price) {
      return NextResponse.json(
        { error: 'El nombre y el precio son obligatorios.' },
        { status: 400 }
      );
    }

    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        name,
        category,
        price: Number(price),
        description,
        imageUrl,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4), // Simple unique slug generator just in case name changes
      },
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: 'Producto actualizado con éxito.',
    });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: error.message || 'Error al actualizar el producto.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: PageProps) {
  try {
    const { id } = await params;

    // Delete related quote items first (or handle cascade - but in schema we didn't define cascade deletes)
    // To prevent database constraint issues:
    await db.quoteItem.deleteMany({
      where: { productId: id },
    });

    const product = await db.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Producto "${product.name}" eliminado correctamente.`,
    });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: error.message || 'Error al eliminar el producto.' },
      { status: 500 }
    );
  }
}

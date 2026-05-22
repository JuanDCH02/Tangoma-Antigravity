import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface PageProps {
  params: Promise<{ id: string }>;
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

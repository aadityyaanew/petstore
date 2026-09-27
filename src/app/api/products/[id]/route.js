import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getProductById, updateProduct, deleteProduct } from '@/lib/services/productService';
import { requireAdmin } from '@/lib/auth';

// GET /api/products/[id] — public
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await getProductById(id);
    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

// PUT /api/products/[id] — admin only
export async function PUT(request, { params }) {
  try {
    await connectDB();
    await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const product = await updateProduct(id, body);
    return NextResponse.json(product);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 400 });
  }
}

// DELETE /api/products/[id] — admin only
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await requireAdmin(request);
    const { id } = await params;
    const result = await deleteProduct(id);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

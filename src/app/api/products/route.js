import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getProducts, createProduct } from '@/lib/services/productService';
import { requireAdmin } from '@/lib/auth';

// GET /api/products — public
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    const data = await getProducts(query);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

// POST /api/products — admin only
export async function POST(request) {
  try {
    await connectDB();
    await requireAdmin(request);
    const body = await request.json();
    const product = await createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 400 });
  }
}

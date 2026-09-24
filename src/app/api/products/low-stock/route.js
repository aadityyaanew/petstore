import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getLowStockProducts } from '@/lib/services/productService';
import { requireAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    await requireAdmin(request);
    const products = await getLowStockProducts();
    return NextResponse.json(products);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getCart, addToCart, clearCart } from '@/lib/services/cartService';
import { requireAuth } from '@/lib/auth';

// GET /api/cart
export async function GET(request) {
  try {
    await connectDB();
    const user = await requireAuth(request);
    const cart = await getCart(user._id);
    return NextResponse.json(cart);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

// POST /api/cart
export async function POST(request) {
  try {
    await connectDB();
    const user = await requireAuth(request);
    const body = await request.json();
    const result = await addToCart(user._id, body);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

// DELETE /api/cart (clear all)
export async function DELETE(request) {
  try {
    await connectDB();
    const user = await requireAuth(request);
    const result = await clearCart(user._id);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

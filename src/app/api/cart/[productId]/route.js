import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { updateCartItem, removeCartItem } from '@/lib/services/cartService';
import { requireAuth } from '@/lib/auth';

// PUT /api/cart/[productId]
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const user = await requireAuth(request);
    const { productId } = await params;
    const { quantity } = await request.json();
    const result = await updateCartItem(user._id, productId, quantity);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

// DELETE /api/cart/[productId]
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const user = await requireAuth(request);
    const { productId } = await params;
    const result = await removeCartItem(user._id, productId);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

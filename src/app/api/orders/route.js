import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { createOrder, getAllOrders } from '@/lib/services/orderService';
import { requireAuth, requireAdmin } from '@/lib/auth';

// POST /api/orders — create order (authenticated user)
export async function POST(request) {
  try {
    await connectDB();
    const user = await requireAuth(request);
    const body = await request.json();
    const order = await createOrder(user._id, body);
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

// GET /api/orders — admin: list all orders
export async function GET(request) {
  try {
    await connectDB();
    await requireAdmin(request);
    const orders = await getAllOrders();
    return NextResponse.json(orders);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getOrderById } from '@/lib/services/orderService';
import { requireAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const user = await requireAuth(request);
    const { id } = await params;
    const order = await getOrderById(id, user);
    return NextResponse.json(order);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

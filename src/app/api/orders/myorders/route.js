import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getMyOrders } from '@/lib/services/orderService';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    const user = await requireAuth(request);
    const orders = await getMyOrders(user._id);
    return NextResponse.json(orders);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

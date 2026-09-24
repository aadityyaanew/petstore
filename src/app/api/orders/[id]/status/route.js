import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { updateOrderStatus } from '@/lib/services/orderService';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    await requireAdmin(request);
    const { id } = await params;
    const { status } = await request.json();
    const order = await updateOrderStatus(id, status);
    return NextResponse.json(order);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

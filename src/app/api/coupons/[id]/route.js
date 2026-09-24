import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Coupon from '@/lib/models/Coupon';
import { requireAdmin } from '@/lib/auth';

// DELETE /api/coupons/[id] — admin
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await requireAdmin(request);
    const { id } = await params;
    const coupon = await Coupon.findById(id);
    if (!coupon) return NextResponse.json({ message: 'Coupon not found' }, { status: 404 });

    await coupon.deleteOne();
    return NextResponse.json({ message: 'Coupon removed' });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Coupon from '@/lib/models/Coupon';
import { requireAuth } from '@/lib/auth';

// POST /api/coupons/apply — authenticated user
export async function POST(request) {
  try {
    await connectDB();
    await requireAuth(request);
    const { code, cartTotal } = await request.json();

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) return NextResponse.json({ message: 'Invalid coupon code' }, { status: 404 });
    if (!coupon.isActive) return NextResponse.json({ message: 'Coupon is no longer active' }, { status: 400 });
    if (new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json({ message: 'Coupon has expired' }, { status: 400 });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue;
    }

    // Ensure we don't discount more than the cart value
    discountAmount = Math.min(discountAmount, cartTotal);

    return NextResponse.json({
      message: 'Coupon applied perfectly',
      code: coupon.code,
      discountAmount,
      newTotal: cartTotal - discountAmount,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: 'Server Error', error: err.message }, { status: 500 });
  }
}

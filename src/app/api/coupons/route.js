import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Coupon from '@/lib/models/Coupon';
import { requireAdmin } from '@/lib/auth';

// GET /api/coupons — admin: list all coupons
export async function GET(request) {
  try {
    await connectDB();
    await requireAdmin(request);
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return NextResponse.json(coupons);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

// POST /api/coupons — admin: create coupon
export async function POST(request) {
  try {
    await connectDB();
    await requireAdmin(request);
    const { code, discountType, discountValue, expiryDate } = await request.json();

    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return NextResponse.json({ message: 'Coupon code already exists' }, { status: 400 });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      expiryDate,
    });

    const createdCoupon = await coupon.save();
    return NextResponse.json(createdCoupon, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: 'Error creating coupon', error: err.message }, { status: 500 });
  }
}

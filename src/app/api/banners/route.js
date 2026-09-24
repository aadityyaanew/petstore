import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Banner from '@/lib/models/Banner';
import { requireAdmin } from '@/lib/auth';

// GET /api/banners (public)
export async function GET() {
  try {
    await connectDB();
    const banners = await Banner.find({ isActive: true }).sort('order');
    return NextResponse.json({ success: true, count: banners.length, banners });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// POST /api/banners (admin)
export async function POST(request) {
  try {
    await connectDB();
    await requireAdmin(request);
    const body = await request.json();
    const banner = await Banner.create(body);
    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

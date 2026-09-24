import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Banner from '@/lib/models/Banner';
import { requireAdmin } from '@/lib/auth';

// GET /api/banners/admin (admin)
export async function GET(request) {
  try {
    await connectDB();
    await requireAdmin(request);
    const banners = await Banner.find().sort('order');
    return NextResponse.json({ success: true, count: banners.length, banners });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

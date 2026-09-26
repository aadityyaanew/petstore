import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/lib/models/Category';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: categories.length, categories });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    await requireAdmin(request);
    const body = await request.json();
    const category = await Category.create(body);
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

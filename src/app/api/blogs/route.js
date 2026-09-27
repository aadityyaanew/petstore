import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/lib/models/Blog';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: blogs.length, blogs });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    await requireAdmin(request);
    const body = await request.json();
    const blog = await Blog.create(body);
    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

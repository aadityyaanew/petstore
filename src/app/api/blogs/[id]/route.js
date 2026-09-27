import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/lib/models/Blog';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const blog = await Blog.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, blog });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await requireAdmin(request);
    const { id } = await params;

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Blog deleted' });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

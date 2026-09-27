import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/lib/models/Category';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, category });
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

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { addReview } from '@/lib/services/productService';
import { requireAuth } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    await connectDB();
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const result = await addReview(id, user._id, {
      ...body,
      name: user.name,
    });
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

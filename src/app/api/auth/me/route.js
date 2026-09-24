import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    const user = await requireAuth(request);
    return NextResponse.json(user);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { resetPassword } from '@/lib/services/authService';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { token } = await params;
    const { password } = await request.json();
    const data = await resetPassword(token, password);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

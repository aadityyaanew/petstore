import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { forgotPassword } from '@/lib/services/authService';

export async function POST(request) {
  try {
    await connectDB();
    const { email } = await request.json();
    const result = await forgotPassword(email);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

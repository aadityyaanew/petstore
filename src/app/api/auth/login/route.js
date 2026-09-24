import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { loginUser } from '@/lib/services/authService';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const data = await loginUser(body);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

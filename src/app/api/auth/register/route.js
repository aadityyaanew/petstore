import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { registerUser } from '@/lib/services/authService';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const data = await registerUser(body);
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

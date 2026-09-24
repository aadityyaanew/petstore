import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getAllUsers } from '@/lib/services/userService';
import { requireAdmin } from '@/lib/auth';

// GET /api/users — admin: list all users
export async function GET(request) {
  try {
    await connectDB();
    await requireAdmin(request);
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

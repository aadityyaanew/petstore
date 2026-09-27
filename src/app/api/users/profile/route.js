import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getUserProfile, updateUserProfile } from '@/lib/services/userService';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/users/profile
export async function GET(request) {
  try {
    await connectDB();
    const user = await requireAuth(request);
    const profile = await getUserProfile(user._id);
    return NextResponse.json(profile);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

// PUT /api/users/profile
export async function PUT(request) {
  try {
    await connectDB();
    const user = await requireAuth(request);
    const body = await request.json();
    console.log('PUT /api/users/profile received body:', body);
    const updatedUser = await updateUserProfile(user._id, body);
    console.log('updatedUser returned from service:', updatedUser);
    return NextResponse.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { updateUserAdmin, deleteUser } from '@/lib/services/userService';
import { requireAdmin } from '@/lib/auth';

// PUT /api/users/[id] — admin
export async function PUT(request, { params }) {
  try {
    await connectDB();
    await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const user = await updateUserAdmin(id, body);
    return NextResponse.json(user);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

// DELETE /api/users/[id] — admin
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await requireAdmin(request);
    const { id } = await params;
    const result = await deleteUser(id);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: err.statusCode || 500 });
  }
}

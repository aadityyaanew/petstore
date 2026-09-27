import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Banner from '@/lib/models/Banner';
import { requireAdmin } from '@/lib/auth';

// PUT /api/banners/[id]
export async function PUT(request, { params }) {
  try {
    await connectDB();
    await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    let banner = await Banner.findById(id);
    if (!banner) {
      return NextResponse.json({ success: false, message: 'Banner not found' }, { status: 404 });
    }

    banner = await Banner.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });

    return NextResponse.json({ success: true, banner });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// DELETE /api/banners/[id]
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await requireAdmin(request);
    const { id } = await params;

    const banner = await Banner.findById(id);
    if (!banner) {
      return NextResponse.json({ success: false, message: 'Banner not found' }, { status: 404 });
    }

    await banner.deleteOne();
    return NextResponse.json({ success: true, data: {} });
  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

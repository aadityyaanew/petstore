import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request) {
  try {
    await requireAdmin(request);
    
    const formData = await request.formData();
    const image = formData.get('image');

    if (!image) {
      return NextResponse.json({ message: 'No image uploaded' }, { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // get extension
    const ext = image.name.split('.').pop();
    const filename = `image-${uniqueSuffix}.${ext}`;

    const uploadDir = join(process.cwd(), 'public/uploads');
    
    // Ensure dir exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const path = join(uploadDir, filename);
    await writeFile(path, buffer);

    // Return URL relative to public/
    return NextResponse.json({ 
      message: 'Image uploaded',
      imageUrl: `/uploads/${filename}` 
    });

  } catch (err) {
    if (err instanceof Response) return err;
    return NextResponse.json({ message: 'Error uploading image', error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

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

    // Upload to Cloudinary using upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'petstore',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ 
      message: 'Image uploaded successfully',
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });

  } catch (err) {
    if (err instanceof Response) return err;
    console.error('Cloudinary upload error:', err);
    return NextResponse.json({ message: 'Error uploading image to Cloudinary', error: err.message }, { status: 500 });
  }
}

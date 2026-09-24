import connectDB from '@/lib/db';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      await connectDB();
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB on server start:', error.message);
    }
  }
}

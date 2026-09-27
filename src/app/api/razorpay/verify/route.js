import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import { verifyRazorpaySignature } from '@/lib/services/razorpayService';
import { requireAuth } from '@/lib/auth';
import { sendOrderConfirmationEmail, sendNewOrderAlertEmail } from '@/lib/services/emailService';

export async function POST(request) {
  try {
    await connectDB();
    const user = await requireAuth(request);
    
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ message: 'Missing payment details' }, { status: 400 });
    }

    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const order = await Order.findOne({ razorpayOrderId, user: user._id }).populate('user', 'name email');
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    if (order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.razorpayPaymentId = razorpayPaymentId;
        order.razorpaySignature = razorpaySignature;
        order.status = 'confirmed';
        await order.save();
        
        // Send emails immediately for verification
        sendOrderConfirmationEmail(order.user, order).catch(console.error);
        sendNewOrderAlertEmail(order, order.user.email).catch(console.error);
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ message: 'Payment verification failed', error: error.message }, { status: 500 });
  }
}

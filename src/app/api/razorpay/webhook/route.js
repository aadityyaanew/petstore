import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import crypto from 'crypto';
import { sendOrderConfirmationEmail, sendNewOrderAlertEmail } from '@/lib/services/emailService';

export async function POST(request) {
  try {
    const signature = request.headers.get('x-razorpay-signature');
    if (!signature) {
      return NextResponse.json({ message: 'Missing signature' }, { status: 400 });
    }

    const rawBody = await request.text();
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      
      // Order ID is stored in notes during checkout, or we can look up by razorpayOrderId
      // Actually, standard razorpay flow links payment to order.
      // We'll use the razorpay order id.
      const rzpOrderId = payment.order_id;
      
      await connectDB();
      const order = await Order.findOne({ razorpayOrderId: rzpOrderId }).populate('user', 'name email');
      
      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.razorpayPaymentId = payment.id;
        order.status = 'confirmed'; // Auto confirm paid orders
        await order.save();

        // Send emails
        sendOrderConfirmationEmail(order.user, order).catch(console.error);
        sendNewOrderAlertEmail(order, order.user.email).catch(console.error);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ message: 'Webhook error' }, { status: 500 });
  }
}

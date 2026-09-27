import Razorpay from 'razorpay';
import crypto from 'crypto';

let instance;

function getRazorpayInstance() {
  if (!instance) {
    instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return instance;
}

/**
 * Generate a Razorpay order
 * @param {number} amount In Rupees (will be multiplied by 100 to convert to paise)
 * @param {string} receipt Receipt ID (optional)
 */
export const createRazorpayOrder = async (amount, receipt) => {
  const options = {
    amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
    currency: 'INR',
    receipt: receipt,
  };

  try {
    const order = await getRazorpayInstance().orders.create(options);
    return order;
  } catch (error) {
    const err = new Error(error.error?.description || 'Error creating Razorpay order');
    err.statusCode = 500;
    throw err;
  }
};

/**
 * Verify Razorpay payment signature
 */
export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(orderId + '|' + paymentId)
    .digest('hex');

  return generatedSignature === signature;
};

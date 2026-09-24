import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import * as razorpayService from './razorpayService.js';
import { sendOrderConfirmationEmail, sendNewOrderAlertEmail, sendLowStockAlertEmail } from './emailService.js';

/**
 * Create a new order, validate stock, decrement stock, and send emails
 */
export const createOrder = async (userId, { shippingAddress, paymentMethod, items, itemsPrice, shippingPrice, totalPrice, couponCode, discountAmount }) => {
  if (!items || items.length === 0) {
    const err = new Error('No order items');
    err.statusCode = 400;
    throw err;
  }

  // ── Step 1: Validate stock for all items ──────────────────────────────────
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      const err = new Error(`Product not found: ${item.name}`);
      err.statusCode = 404;
      throw err;
    }
    if (product.stock < item.quantity) {
      const err = new Error(
        `Not enough stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`
      );
      err.statusCode = 400;
      throw err;
    }
  }

  const orderData = {
    user: userId,
    items,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    couponCode,
    discountAmount,
    totalPrice,
  };

  // ── Step 2: Branch by payment method ──────────────────────────────────────
  if (paymentMethod === 'Card' || paymentMethod === 'UPI') {
    // Create the order record first
    const initialOrder = await Order.create(orderData);

    // Create Razorpay order
    const rzpOrder = await razorpayService.createRazorpayOrder(totalPrice, initialOrder._id.toString());
    initialOrder.razorpayOrderId = rzpOrder.id;
    await initialOrder.save();

    // Decrement stock immediately (cart is also cleared below)
    await decrementStock(items);

    // Fire low-stock alerts (fire-and-forget)
    checkAndSendLowStockAlert(items);

    // Clear cart
    await Cart.findOneAndDelete({ user: userId });

    return {
      order: initialOrder,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
    };
  } else {
    // ── COD Flow ──────────────────────────────────────────────────────────
    orderData.paymentMethod = 'COD';
    orderData.paymentStatus = 'pending';
    const order = await Order.create(orderData);

    // Decrement stock
    await decrementStock(items);

    // Fire low-stock alerts (fire-and-forget)
    checkAndSendLowStockAlert(items);

    // Clear cart
    await Cart.findOneAndDelete({ user: userId });

    // Send emails (fire-and-forget — don't block order creation if email fails)
    const user = await User.findById(userId).select('name email');
    if (user) {
      sendOrderConfirmationEmail(user, order).catch((e) =>
        console.error('Order confirmation email failed:', e.message)
      );
      sendNewOrderAlertEmail(order, user.email).catch((e) =>
        console.error('Admin alert email failed:', e.message)
      );
    }

    return order;
  }
};

/**
 * Atomically decrement stock for all ordered items
 */
const decrementStock = async (items) => {
  const bulkOps = items.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { stock: -item.quantity } },
    },
  }));
  await Product.bulkWrite(bulkOps);
};

/**
 * After decrementing, check if any products are at or below lowStockThreshold
 * and send an alert email (fire-and-forget)
 */
const checkAndSendLowStockAlert = (items) => {
  const productIds = items.map((i) => i.product);
  Product.find({ _id: { $in: productIds } })
    .then((products) => {
      const lowStockItems = products.filter((p) => p.stock <= p.lowStockThreshold);
      if (lowStockItems.length > 0) {
        sendLowStockAlertEmail(lowStockItems).catch((e) =>
          console.error('Low stock alert email failed:', e.message)
        );
      }
    })
    .catch((e) => console.error('Low stock check failed:', e.message));
};

/**
 * Get all orders for the logged-in user
 */
export const getMyOrders = async (userId) => {
  return await Order.find({ user: userId }).sort({ createdAt: -1 });
};

/**
 * Get a single order by ID (with ownership/admin check)
 */
export const getOrderById = async (orderId, requestingUser) => {
  const order = await Order.findById(orderId).populate('user', 'name email');
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }

  const isOwner = order.user._id.toString() === requestingUser._id.toString();
  const isAdmin = requestingUser.role === 'admin';
  if (!isOwner && !isAdmin) {
    const err = new Error('Not authorized');
    err.statusCode = 403;
    throw err;
  }

  return order;
};

/**
 * Get all orders (admin only)
 */
export const getAllOrders = async () => {
  return await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
};

/**
 * Update an order's status (admin only)
 */
export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }

  order.status = status;
  if (status === 'delivered') order.deliveredAt = Date.now();
  await order.save();

  return order;
};

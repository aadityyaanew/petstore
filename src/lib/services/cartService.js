import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/**
 * Get a user's cart
 */
export const getCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name images price stock');
  if (!cart) return { items: [], totalPrice: 0 };

  return {
    _id: cart._id,
    items: cart.items,
    totalPrice: cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
  };
};

/**
 * Add an item to the cart
 */
export const addToCart = async (userId, { productId, quantity = 1 }) => {
  const product = await Product.findById(productId);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  if (product.stock < quantity) {
    const err = new Error('Insufficient stock');
    err.statusCode = 400;
    throw err;
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = new Cart({ user: userId, items: [] });

  const existingItem = cart.items.find(i => i.product.toString() === productId);
  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity), price: product.price });
  }

  await cart.save();
  return { message: 'Cart updated', itemCount: cart.items.length };
};

/**
 * Update the quantity of an item in the cart
 */
export const updateCartItem = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    const err = new Error('Cart not found');
    err.statusCode = 404;
    throw err;
  }

  const item = cart.items.find(i => i.product.toString() === productId);
  if (!item) {
    const err = new Error('Item not in cart');
    err.statusCode = 404;
    throw err;
  }

  if (Number(quantity) <= 0) {
    cart.items = cart.items.filter(i => i.product.toString() !== productId);
  } else {
    item.quantity = Number(quantity);
  }

  await cart.save();
  return { message: 'Cart updated' };
};

/**
 * Remove a specific item from the cart
 */
export const removeCartItem = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    const err = new Error('Cart not found');
    err.statusCode = 404;
    throw err;
  }

  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  await cart.save();
  return { message: 'Item removed from cart' };
};

/**
 * Clear the entire cart
 */
export const clearCart = async (userId) => {
  await Cart.findOneAndDelete({ user: userId });
  return { message: 'Cart cleared' };
};

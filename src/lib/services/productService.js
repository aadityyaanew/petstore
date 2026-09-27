import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';

/**
 * Get all products with optional filtering, sorting, and pagination
 */
export const getProducts = async ({ search, category, minPrice, maxPrice, sort, page = 1, limit = 12, featured, pet, brand, tag }) => {
  const query = {};

  if (search) query.name = { $regex: search, $options: 'i' };
  if (category && category !== 'All') query.category = category;
  if (pet && pet !== 'all') query.petType = pet;
  if (brand && brand !== 'all') query.brand = brand;
  if (tag) query.tags = tag;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (featured === 'true') query.isFeatured = true;

  const sortOptions = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    'rating': { rating: -1 },
    'newest': { createdAt: -1 },
  };
  const sortBy = sortOptions[sort] || { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query).sort(sortBy).skip(skip).limit(Number(limit)).lean();

  return { products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
};

/**
 * Get a single product by ID
 */
export const getProductById = async (id) => {
  const mongoose = require('mongoose');
  let product;
  
  if (mongoose.isValidObjectId(id)) {
    product = await Product.findById(id).lean();
  } else {
    product = await Product.findOne({ slug: id }).lean();
  }
  
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  
  // Fetch reviews from the new Review model
  const reviews = await Review.find({ product: product._id }).populate('user', 'name').sort({ createdAt: -1 });
  product.reviews = reviews;
  
  return product;
};

/**
 * Create a new product (admin)
 */
export const createProduct = async (data) => {
  const product = await Product.create(data);
  return product.toJSON();
};

/**
 * Update an existing product (admin)
 */
export const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
};

/**
 * Delete a product (admin)
 */
export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return { message: 'Product removed' };
};

/**
 * Add a review to a product
 */
export const addReview = async (productId, userId, { rating, comment, name }) => {
  const product = await Product.findById(productId);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }

  // 1. Check if user has already reviewed this product
  const alreadyReviewed = await Review.findOne({ product: productId, user: userId });
  if (alreadyReviewed) {
    const err = new Error('You have already reviewed this product');
    err.statusCode = 400;
    throw err;
  }

  // 2. Check if user actually purchased the product
  const hasPurchased = await Order.findOne({
    user: userId,
    'items.product': productId,
    status: { $nin: ['Cancelled', 'cancelled', 'Failed', 'failed'] }
  });

  if (!hasPurchased) {
    const err = new Error('You can only review products that you have purchased.');
    err.statusCode = 403;
    throw err;
  }

  // 3. Create the review
  await Review.create({
    product: productId,
    user: userId,
    name,
    rating: Number(rating),
    comment,
    isVerifiedPurchase: true,
  });

  // 4. Update product rating stats
  const allReviews = await Review.find({ product: productId });
  product.numReviews = allReviews.length;
  product.rating = allReviews.length > 0 
    ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length 
    : 0;
  
  await product.save();

  return { message: 'Review added successfully' };
};

/**
 * Get products with stock at or below their lowStockThreshold (admin)
 */
export const getLowStockProducts = async () => {
  return await Product.find({
    $expr: { $lte: ['$stock', '$lowStockThreshold'] },
  }).sort({ stock: 1 }).lean();
};

import Product from '../models/Product.js';

/**
 * Get all products with optional filtering, sorting, and pagination
 */
export const getProducts = async ({ search, category, minPrice, maxPrice, sort, page = 1, limit = 12, featured }) => {
  const query = {};

  if (search) query.name = { $regex: search, $options: 'i' };
  if (category && category !== 'All') query.category = category;
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
  const products = await Product.find(query).sort(sortBy).skip(skip).limit(Number(limit));

  return { products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
};

/**
 * Get a single product by ID
 */
export const getProductById = async (id) => {
  const product = await Product.findById(id).populate('reviews.user', 'name');
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
};

/**
 * Create a new product (admin)
 */
export const createProduct = async (data) => {
  return await Product.create(data);
};

/**
 * Update an existing product (admin)
 */
export const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
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

  const alreadyReviewed = product.reviews.find(r => r.user.toString() === userId.toString());
  if (alreadyReviewed) {
    const err = new Error('Already reviewed');
    err.statusCode = 400;
    throw err;
  }

  product.reviews.push({ user: userId, name, rating: Number(rating), comment });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
  await product.save();

  return { message: 'Review added' };
};

/**
 * Get products with stock at or below their lowStockThreshold (admin)
 */
export const getLowStockProducts = async () => {
  return await Product.find({
    $expr: { $lte: ['$stock', '$lowStockThreshold'] },
  }).sort({ stock: 1 });
};

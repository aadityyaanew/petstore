import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0,
  },
  originalPrice: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Electronics', 'Clothing', 'Footwear', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys'],
  },
  brand: {
    type: String,
    default: '',
  },
  images: {
    type: [String],
    default: [],
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
    min: 0,
  },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);

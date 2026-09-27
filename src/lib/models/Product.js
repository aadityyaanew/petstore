import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  isVerifiedPurchase: { type: Boolean, default: false },
}, { timestamps: true });

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String, default: '' },
  isPrimary: { type: Boolean, default: false },
});

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  stock: { type: Number, default: 0 },
});

const specSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, sparse: true },
  shortDescription: { type: String },
  description: { type: String, required: true },
  
  category: { type: String, required: true },
  subCategory: { type: String },
  petType: { type: String, default: 'parrot' },
  brand: { type: String, default: '' },
  
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  
  images: [mongoose.Schema.Types.Mixed],
  
  sku: { type: String, default: '' },
  stock: { type: Number, required: true, min: 0, default: 0 },
  lowStockThreshold: { type: Number, default: 5, min: 0 },
  trackInventory: { type: Boolean, default: true },
  
  variants: [variantSchema],
  highlights: [String],
  specs: [specSchema],
  care: { type: String, default: '' },
  
  feedingInstructions: {
    description: String,
    recommendedAge: String,
    waterRequired: Boolean,
  },
  
  faqs: [faqSchema],
  
  shipping: {
    weight: Number,
    weightUnit: { type: String, default: 'kg' },
    freeShipping: { type: Boolean, default: false },
    shippingCharge: { type: Number, default: 0 },
    estimatedDeliveryDays: {
      min: Number,
      max: Number,
    }
  },
  
  returnPolicy: {
    returnable: { type: Boolean, default: true },
    returnWindowDays: { type: Number, default: 7 },
    conditions: { type: String, default: '' },
  },
  
  tags: [String],
  
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
  
  reviews: [reviewSchema], // User wanted another model, but to keep existing code functional and just add to it, it's safer to keep this or define a separate Review model. I will also create Review.js, but since the schema expects an array for MVP compatibility I'll keep this here and migrate gradually.
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);

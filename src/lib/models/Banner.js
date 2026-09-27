import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  image: {
    type: String, // URL for the banner image
  },
  gradient: {
    type: String, // Fallback background gradient
    default: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'
  },
  buttonText: {
    type: String,
    default: 'Shop Now'
  },
  buttonLink: {
    type: String,
    default: '/products'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.models.Banner || mongoose.model('Banner', bannerSchema);

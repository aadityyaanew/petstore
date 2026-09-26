import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Blog content is required'],
  },
  excerpt: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: 'Admin',
  },
  tag: {
    type: String,
    default: 'General',
  },
  readTime: {
    type: String,
    default: '5 min read',
  },
  date: {
    type: String,
    default: '',
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);

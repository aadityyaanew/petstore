import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/lib/models/User.js';
import Product from '../src/lib/models/Product.js';
import connectDB from '../src/lib/db.js';

dotenv.config({ path: '.env.local' });

// Add mock admin data here so we can create it
const adminData = {
  name: 'Admin User',
  email: process.env.ADMIN_EMAIL || 'admin@gmail.com',
  password: 'admin@123',
  role: 'admin',
};

const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio quality.',
    price: 14999,
    originalPrice: 19999,
    category: 'Electronics',
    brand: 'SoundMaster',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
    stock: 25,
    isFeatured: true,
  },
  {
    name: 'Minimalist Leather Watch',
    description: 'Elegant timepiece with genuine leather strap, water resistance, and precision quartz movement.',
    price: 3499,
    originalPrice: 5999,
    category: 'Clothing',
    brand: 'Tempo',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    stock: 15,
    isFeatured: true,
  },
  {
    name: 'Smart Fitness Tracker',
    description: 'Track your health, sleep, and workouts with this sleek, water-resistant smart band.',
    price: 2999,
    originalPrice: 4999,
    category: 'Electronics',
    brand: 'FitPro',
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80'],
    stock: 50,
    isFeatured: false,
  },
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Ultra-soft, breathable 100% organic cotton t-shirt. Perfect for everyday wear.',
    price: 799,
    originalPrice: 1299,
    category: 'Clothing',
    brand: 'Essentials',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
    stock: 100,
    isFeatured: false,
  },
  {
    name: 'Professional DSLR Camera',
    description: '24.2 MP DSLR camera with 4K video recording, perfect for photography enthusiasts.',
    price: 45999,
    originalPrice: 52999,
    category: 'Electronics',
    brand: 'Optics',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80'],
    stock: 5,
    isFeatured: true,
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Fully adjustable ergonomic chair with lumbar support for long hours of comfortable working.',
    price: 8999,
    originalPrice: 12999,
    category: 'Home & Kitchen',
    brand: 'Comfort+',
    images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80'],
    stock: 12,
    isFeatured: false,
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    console.log('Clearing database...');
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Seeding admin user...');
    await User.create(adminData);

    console.log('Seeding products...');
    await Product.insertMany(products);

    console.log('✅ Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();

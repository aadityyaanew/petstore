import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendPasswordResetEmail } from './emailService.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Register a new user
 */
export const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    const err = new Error('Please fill all fields');
    err.statusCode = 400;
    throw err;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.create({ name, email, password });
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

/**
 * Login an existing user
 */
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

/**
 * Forgot Password — generates a reset token and sends email
 */
export const forgotPassword = async (email) => {
  if (!email) {
    const err = new Error('Please provide an email address');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email });
  if (!user) {
    // Security: don't reveal that the email doesn't exist
    return { message: 'If that email is registered, you will receive a reset link shortly.' };
  }

  // Generate a raw token (sent in email link)
  const rawToken = crypto.randomBytes(32).toString('hex');

  // Store a hashed version in DB
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save({ validateBeforeSave: false });

  // Build reset URL pointing to the frontend
  const resetUrl = `${process.env.APP_URL}/reset-password/${rawToken}`;

  try {
    await sendPasswordResetEmail(user, resetUrl);
    return { message: 'If that email is registered, you will receive a reset link shortly.' };
  } catch (emailError) {
    // Roll back token if email fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    const err = new Error('Email could not be sent. Please try again later.');
    err.statusCode = 500;
    throw err;
  }
};

/**
 * Reset Password — validates token and sets new password
 */
export const resetPassword = async (rawToken, newPassword) => {
  if (!newPassword || newPassword.length < 6) {
    const err = new Error('Password must be at least 6 characters');
    err.statusCode = 400;
    throw err;
  }

  // Hash the incoming token to compare with DB
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }, // token not expired
  });

  if (!user) {
    const err = new Error('Invalid or expired password reset token');
    err.statusCode = 400;
    throw err;
  }

  // Set new password and clear token fields
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

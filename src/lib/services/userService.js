import User from '../models/User.js';

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId) => {
  return await User.findById(userId).select('-password');
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, { name, address, currentPassword, newPassword }) => {
  const user = await User.findById(userId);

  if (name) user.name = name;
  if (address) user.address = address;

  if (currentPassword && newPassword) {
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      const err = new Error('Current password is incorrect');
      err.statusCode = 400;
      throw err;
    }
    user.password = newPassword;
  }

  await user.save();
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    address: user.address,
  };
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async () => {
  return await User.find({}).select('-password');
};

/**
 * Delete a user (admin only)
 */
export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return { message: 'User removed' };
};

/**
 * Update user details (admin only)
 */
export const updateUserAdmin = async (id, { name, email, role }) => {
  const user = await User.findById(id);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  const updatedUser = await user.save();
  return {
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  };
};

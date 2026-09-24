import jwt from 'jsonwebtoken';
import User from './models/User.js';
import connectDB from './db.js';

/**
 * Authenticate user from Authorization header.
 * Returns the user document (without password) or null.
 */
export async function getAuthUser(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    await connectDB();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Require authentication — returns user or throws a Response.
 */
export async function requireAuth(request) {
  const user = await getAuthUser(request);
  if (!user) {
    throw new Response(
      JSON.stringify({ message: 'Not authorized, no token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  return user;
}

/**
 * Require admin role — returns user or throws a Response.
 */
export async function requireAdmin(request) {
  const user = await requireAuth(request);
  if (user.role !== 'admin') {
    throw new Response(
      JSON.stringify({ message: 'Access denied. Admins only.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }
  return user;
}

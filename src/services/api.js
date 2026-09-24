import axios from 'axios';

const API_URL = '/api';
export const BASE_URL = '';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const api = {
  // Auth
  register: (userData) => axiosInstance.post('/auth/register', userData),
  login: (userData) => axiosInstance.post('/auth/login', userData),
  getMe: () => axiosInstance.get('/auth/me'),
  forgotPassword: (email) => axiosInstance.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => axiosInstance.put(`/auth/reset-password/${token}`, { password }),

  // Products
  getProducts: (params) => axiosInstance.get('/products', { params }),
  getProductById: (id) => axiosInstance.get(`/products/${id}`),
  addReview: (id, reviewData) => axiosInstance.post(`/products/${id}/review`, reviewData),
  getLowStockProducts: () => axiosInstance.get('/products/low-stock'),

  // Cart
  getCart: () => axiosInstance.get('/cart'),
  addToCart: (productId, quantity) => axiosInstance.post('/cart', { productId, quantity }),
  updateCartItem: (productId, quantity) => axiosInstance.put(`/cart/${productId}`, { quantity }),
  removeFromCart: (productId) => axiosInstance.delete(`/cart/${productId}`),
  emptyCart: () => axiosInstance.delete('/cart'),

  // Orders
  placeOrder: (orderData) => axiosInstance.post('/orders', orderData),
  getMyOrders: () => axiosInstance.get('/orders/myorders'),
  getOrderById: (id) => axiosInstance.get(`/orders/${id}`),

  // Razorpay
  getRazorpayKey: () => axiosInstance.get('/razorpay/key'),
  verifyRazorpayPayment: (data) => axiosInstance.post('/razorpay/verify', data),

  // Admin Products
  createProduct: (data) => axiosInstance.post('/products', data),
  updateProduct: (id, data) => axiosInstance.put(`/products/${id}`, data),
  deleteProduct: (id) => axiosInstance.delete(`/products/${id}`),

  // Admin Orders
  getAllOrders: () => axiosInstance.get('/orders'),
  updateOrderStatus: (id, status) => axiosInstance.put(`/orders/${id}/status`, { status }),

  // Admin Users
  getAllUsers: () => axiosInstance.get('/users'),
  updateUserAdmin: (id, data) => axiosInstance.put(`/users/${id}`, data),
  deleteUserAdmin: (id) => axiosInstance.delete(`/users/${id}`),

  // Coupons
  getCoupons: () => axiosInstance.get('/coupons'),
  createCoupon: (data) => axiosInstance.post('/coupons', data),
  deleteCoupon: (id) => axiosInstance.delete(`/coupons/${id}`),
  applyCoupon: (data) => axiosInstance.post('/coupons/apply', data),

  // Analytics
  getAnalyticsStats: () => axiosInstance.get('/analytics'),
  
  // Banners
  getBanners: () => axiosInstance.get('/banners'),
  getAdminBanners: () => axiosInstance.get('/banners/admin'),
  createBanner: (data) => axiosInstance.post('/banners', data),
  updateBanner: (id, data) => axiosInstance.put(`/banners/${id}`, data),
  deleteBanner: (id) => axiosInstance.delete(`/banners/${id}`),

  // File Upload
  uploadImage: (formData) => axiosInstance.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default api;

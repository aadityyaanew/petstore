import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './views/Home';
import Products from './views/Products';
import ProductDetails from './views/ProductDetails';
import Cart from './views/Cart';
import Checkout from './views/Checkout';
import OrderSuccess from './views/OrderSuccess';
import Profile from './views/Profile';
import Login from './views/Login';
import Register from './views/Register';
import Orders from './views/Orders';
import ForgotPassword from './views/ForgotPassword';
import ResetPassword from './views/ResetPassword';
import FAQ from './views/FAQ';
import Shipping from './views/Shipping';
import Returns from './views/Returns';
import ContactUs from './views/ContactUs';
import AboutUs from './views/AboutUs';
import PrivacyPolicy from './views/PrivacyPolicy';
import TermsConditions from './views/TermsConditions';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './views/admin/AdminDashboard';
import AdminProducts from './views/admin/AdminProducts';
import AdminOrders from './views/admin/AdminOrders';
import AdminUsers from './views/admin/AdminUsers';
import AdminCoupons from './views/admin/AdminCoupons';
import AdminBanners from './views/admin/AdminBanners';

// Add PrivateRoute logic optionally if needed, but the layout and backend will protect it anyway.
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route path="profile" element={<Profile />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="orders" element={<Orders />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="shipping" element={<Shipping />} />
        <Route path="returns" element={<Returns />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermsConditions />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="banners" element={<AdminBanners />} />
      </Route>
    </Routes>
  );
}

export default App;

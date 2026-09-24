'use client';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Button } from './ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  ShoppingCart, Search, Menu, X, User,
  Package, Phone, Mail, MapPin, Heart, ChevronDown, Bird
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = cart?.items?.length || 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* ── TOP CONTACT INFO BAR ── */}
      <div className="bg-[#FAFBFD] border-b border-gray-100 text-xs md:text-sm text-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left: Phone & Email */}
          <div className="flex items-center gap-6">
            <a
              href="tel:+18001234567"
              className="flex items-center gap-1.5 hover:text-[#E050D0] transition-colors"
            >
              <Phone size={14} className="text-gray-900" />
              <span className="font-medium">+1 (800) 123-4567</span>
            </a>
            <a
              href="mailto:support@poonchpetstore.com"
              className="flex items-center gap-1.5 hover:text-[#E050D0] transition-colors"
            >
              <Mail size={14} className="text-gray-900" />
              <span className="font-medium">support@poonchpetstore.com</span>
            </a>
          </div>

          {/* Right: Address */}
          <div className="flex items-center gap-1.5 text-gray-700">
            <MapPin size={14} className="text-gray-900 shrink-0" />
            <span className="font-medium truncate">123 Pet Care Way, Suite A, City, State, ZIP</span>
          </div>
        </div>
      </div>

      {/* ── MAIN FLOATING NAVBAR ── */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md py-2.5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-gray-100/90 px-5 sm:px-6 py-2.5 flex items-center justify-between gap-4">
            
            {/* Left: Mobile Menu + Logo */}
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-1.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <Link to="/" className="flex items-center gap-2.5 group">
                <img
                  src="/logo.jpeg"
                  alt="Poonch Pet Store"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#E050D0]/30 group-hover:ring-[#E050D0] transition-all"
                />
                <span className="font-extrabold text-base sm:text-lg text-black tracking-tight group-hover:text-[#E050D0] transition-colors">
                  Poonch Pet Store
                </span>
              </Link>
            </div>

            {/* Center: Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-7 lg:gap-9">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      "text-sm font-semibold transition-all relative py-1",
                      isActive
                        ? "text-[#E050D0] after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-[#E050D0] after:rounded-full"
                        : "text-gray-800 hover:text-[#E050D0]"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Search, Wishlist, Cart, Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Pill Search Input with Black Circle Button (Desktop) */}
              <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#F4F5F7] text-xs sm:text-sm text-gray-900 rounded-full pl-4 pr-11 py-2 w-44 focus:w-56 transition-all duration-300 outline-none border border-transparent focus:border-[#E050D0]/40 placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-1 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer shadow-sm"
                  aria-label="Search"
                >
                  <Search size={13} strokeWidth={2.5} />
                </button>
              </form>

              {/* Wishlist Heart Icon with Badge */}
              <button
                onClick={() => navigate('/products')}
                className="relative p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart size={20} strokeWidth={2} />
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] min-h-[18px] bg-[#E050D0] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none px-1 shadow-sm">
                  {wishlistCount}
                </span>
              </button>

              {/* Shopping Cart Icon with Badge */}
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
                aria-label="Shopping Cart"
                title="Cart"
              >
                <ShoppingCart size={20} strokeWidth={2} />
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] min-h-[18px] bg-[#E050D0] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none px-1 shadow-sm">
                  {cartCount}
                </span>
              </button>

              {/* User Account Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
                      </div>
                      <ChevronDown size={13} className="text-gray-500 hidden sm:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-gray-100">
                    <DropdownMenuLabel className="font-bold text-gray-900">{user.name || 'My Account'}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User size={14} className="mr-2" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/orders')}>
                      <Package size={14} className="mr-2" /> My Orders
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="text-[#E050D0] font-semibold">
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 font-semibold">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
                  aria-label="Account Login"
                  title="Sign In"
                >
                  <User size={20} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out px-4",
            mobileOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
          )}
        >
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 space-y-2">
            {/* Search form in mobile drawer */}
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F4F5F7] text-sm text-gray-900 rounded-full pl-4 pr-11 py-2.5 outline-none border border-transparent focus:border-[#E050D0]"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center"
              >
                <Search size={13} />
              </button>
            </form>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-xl text-sm font-semibold transition-colors",
                  location.pathname === link.to ? "bg-[#E050D0]/10 text-[#E050D0]" : "text-gray-800 hover:bg-gray-100"
                )}
              >
                {link.label}
              </Link>
            ))}

            {!user && (
              <Button
                className="w-full bg-black hover:bg-neutral-800 text-white rounded-full mt-2"
                onClick={() => { navigate('/login'); setMobileOpen(false); }}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;

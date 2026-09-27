'use client';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

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

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);

  // Debounce search query (3 seconds as requested)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 3000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (!debouncedQuery) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const fetchSuggestions = async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(debouncedQuery)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.products || []);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error('Failed to fetch suggestions', err);
      } finally {
        setIsSearching(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        // Check if at the top
        setIsAtTop(currentScrollY <= 20);
      }
    };

    window.addEventListener('scroll', controlNavbar, { passive: true });
    return () => window.removeEventListener('scroll', controlNavbar);
  }, []);

  const cartCount = cart?.items?.length || 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSuggestions(false);
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderSuggestions = () => {
    if (isSearching) {
      return (
        <div className="p-4 text-center text-xs text-gray-500 font-medium">
          <div className="w-4 h-4 border-2 border-[#E050D0] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Searching...
        </div>
      );
    }

    if (suggestions.length > 0) {
      return (
        <div className="py-2">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-50 mb-1">
            Products
          </div>
          {suggestions.map((p) => (
            <Link
              key={p._id}
              to={`/product/${p._id}`}
              onClick={() => {
                setShowSuggestions(false);
                setSearchQuery('');
                setMobileOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              <img src={p.images?.[0] || '/placeholder.png'} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
              <div className="flex-1 min-w-0 text-left">
                <h4 className="text-xs font-bold text-gray-900 truncate">{p.name}</h4>
                <p className="text-[11px] text-[#E050D0] font-semibold">₹{p.price?.toFixed(2) || '0.00'}</p>
              </div>
            </Link>
          ))}
          <button
            onClick={handleSearchSubmit}
            className="w-full text-center py-2.5 mt-1 border-t border-gray-50 text-xs font-bold text-gray-600 hover:text-[#E050D0] hover:bg-gray-50 transition-colors"
          >
            View All Results
          </button>
        </div>
      );
    }

    if (debouncedQuery) {
      return (
        <div className="p-4 text-center text-xs text-gray-500 font-medium">
          No products found for "{debouncedQuery}"
        </div>
      );
    }

    return (
      <div className="p-4 text-center text-xs text-gray-500 font-medium">
        <div className="w-4 h-4 border-2 border-[#E050D0] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Searching...
      </div>
    );
  };

  return (
    <>
      {/* ── TOP CONTACT INFO BAR ── */}
      <div className="hidden md:block bg-[#FAFBFD] border-b border-gray-100 text-[11px] sm:text-xs md:text-sm text-gray-700">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-1.5 sm:py-2 flex items-center justify-between gap-2">
          {/* Left: Phone & Email */}
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 sm:gap-6">
            <a
              href="tel:+917088202122"
              className="flex items-center gap-1.5 hover:text-[#E050D0] transition-colors whitespace-nowrap"
            >
              <Phone size={13} className="text-gray-900 shrink-0" />
              <span className="font-medium">+91 7088202122</span>
            </a>
            <span className="text-gray-300 sm:hidden">•</span>
            <a
              href="mailto:[EMAIL_ADDRESS]"
              className="flex items-center gap-1.5 hover:text-[#E050D0] transition-colors truncate"
            >
              <Mail size={13} className="text-gray-900 shrink-0" />
              <span className="font-medium truncate max-w-[150px] xs:max-w-[210px] sm:max-w-none">
                support@poonchpetstore.com
              </span>
            </a>
          </div>

          {/* Right: Address (Desktop/Tablet) */}
          <div className="hidden md:flex items-center gap-1.5 text-gray-700 shrink-0">
            <MapPin size={13} className="text-gray-900 shrink-0" />
            <span className="font-medium truncate">Jai Devi Nagar, Garh Road , Meerut</span>
          </div>
        </div>
      </div>

      {/* ── MAIN FLOATING NAVBAR ── */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isAtTop
            ? "bg-transparent pt-3 sm:pt-4"
            : "bg-white/95 backdrop-blur-md shadow-sm"
        )}
      >
        <div className={cn(
          "transition-all duration-300 mx-auto",
          isAtTop ? "max-w-7xl px-3 sm:px-6 lg:px-8" : "w-full"
        )}>
          <div className={cn(
            "transition-all duration-300 flex items-center justify-between gap-2 sm:gap-4 mx-auto",
            isAtTop
              ? "bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100/90 px-3.5 xs:px-4 sm:px-6 py-2 sm:py-2.5"
              : "max-w-7xl bg-transparent px-4 sm:px-6 lg:px-8 py-3"
          )}>

            {/* Left: Mobile Menu + Logo */}
            <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 shrink-0">
              <button
                className="md:hidden p-1.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors touch-manipulation cursor-pointer"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group">
                <img
                  src="/logo.jpeg"
                  alt="Poonch Pet Store"
                  className="w-7 h-7 xs:w-8 xs:h-8 rounded-full object-cover ring-2 ring-[#E050D0]/30 group-hover:ring-[#E050D0] transition-all shrink-0"
                />
                <span className="font-[family-name:var(--font-lora)] font-bold text-lg xs:text-xl sm:text-xl text-black tracking-tight group-hover:text-[#E050D0] transition-colors truncate max-w-[145px] xs:max-w-[180px] sm:max-w-none">
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
            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 shrink-0">

              {/* Pill Search Input with Black Circle Button (Desktop) */}
              <div ref={searchContainerRef} className="hidden lg:flex items-center relative">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
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

                {showSuggestions && searchQuery && (
                  <div className="absolute top-full mt-2 right-0 w-72 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50 max-h-80 overflow-y-auto">
                    {renderSuggestions()}
                  </div>
                )}
              </div>


              {/* Shopping Cart Icon with Badge */}
              <button
                onClick={() => navigate('/cart')}
                className="relative p-1.5 xs:p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer touch-manipulation"
                aria-label="Shopping Cart"
                title="Cart"
              >
                <ShoppingCart size={19} strokeWidth={2} />
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] bg-[#E050D0] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none px-1 shadow-sm">
                  {cartCount}
                </span>
              </button>

              {/* User Account Menu */}
              {user ? (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer touch-manipulation">
                      <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
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
                  className="p-1.5 xs:p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer touch-manipulation"
                  aria-label="Account Login"
                  title="Sign In"
                >
                  <User size={19} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            mobileOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0",
            isAtTop ? "px-3.5" : "px-0"
          )}
        >
          <div className={cn(
            "bg-white p-4 shadow-xl border-gray-100 space-y-2.5",
            isAtTop ? "rounded-2xl border" : "rounded-none border-t"
          )}>
            {/* Search form in mobile drawer */}
            <div className="relative mb-3">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-[#F4F5F7] text-sm text-gray-900 rounded-full pl-4 pr-11 py-2.5 outline-none border border-transparent focus:border-[#E050D0]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center cursor-pointer shadow-sm"
                >
                  <Search size={13} />
                </button>
              </form>

              {showSuggestions && searchQuery && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50 max-h-60 overflow-y-auto">
                  {renderSuggestions()}
                </div>
              )}
            </div>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                  location.pathname === link.to ? "bg-[#E050D0]/10 text-[#E050D0]" : "text-gray-800 hover:bg-gray-100"
                )}
              >
                {link.label}
              </Link>
            ))}


            {user ? (
              <div className="pt-2 border-t border-gray-100 space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  <User size={16} /> My Profile ({user.name || 'Account'})
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  <Package size={16} /> My Orders
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold text-[#E050D0] hover:bg-[#E050D0]/10"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Button
                className="w-full bg-black hover:bg-neutral-800 text-white rounded-full mt-2 py-2.5 text-sm font-bold"
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

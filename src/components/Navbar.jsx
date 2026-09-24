'use client';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Button } from './ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  ShoppingCart, Search, Menu, X, Download, User, Home,
  Package, Info, Phone, ChevronDown, Paw
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { isInstallable, installPWA } = usePWAInstall();

  const cartCount = cart?.items?.length || 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchOpen(false);
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-brand-pink/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/assets/logowhite.jpeg"
                alt="Poonch Pet Store"
                className="w-10 h-10 rounded-full object-cover border-2 border-brand-pink/25 group-hover:border-brand-pink transition-all duration-300 group-hover:scale-105"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-extrabold text-brand-charcoal leading-none tracking-tight">
                  Poonch Pet Store
                </p>
                <p className="text-[10px] font-semibold text-brand-pink uppercase tracking-widest leading-none mt-0.5">
                  Safe Play, Happy Tails 🐾
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-2 text-sm font-semibold text-foreground rounded-lg transition-all duration-200 hover:bg-brand-pink/8 hover:text-brand-pink"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="hidden md:flex items-center">
                {searchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center animate-fade-in">
                    <div className="flex items-center gap-2 bg-brand-pink/5 border border-brand-pink/20 rounded-lg px-3 py-1.5">
                      <Search size={16} className="text-brand-pink shrink-0" />
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-sm outline-none w-44 placeholder:text-muted-foreground"
                      />
                      <button type="button" onClick={() => setSearchOpen(false)}>
                        <X size={14} className="text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                    aria-label="Search"
                  >
                    <Search size={20} />
                  </button>
                )}
              </div>

              {/* Install PWA */}
              {isInstallable && (
                <Button variant="outline-pink" size="sm" onClick={installPWA} className="hidden sm:flex gap-1.5">
                  <Download size={14} />
                  Install
                </Button>
              )}

              {/* Cart */}
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] min-h-[18px] bg-brand-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none px-1">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="hidden sm:flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-accent transition-colors">
                      <div className="w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center text-white text-sm font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
                      </div>
                      <ChevronDown size={14} className="text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>{user.name || 'My Account'}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User size={14} className="mr-2" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/orders')}>
                      <Package size={14} className="mr-2" /> My Orders
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="text-brand-pink font-semibold">
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive font-semibold">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="secondary" size="sm" className="hidden sm:flex" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-border",
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="px-4 py-4 bg-white space-y-1">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mb-3">
              <div className="flex items-center gap-2 bg-brand-pink/5 border border-brand-pink/15 rounded-xl px-3 py-2.5">
                <Search size={16} className="text-brand-pink shrink-0" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
                />
              </div>
            </form>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-sm font-semibold text-foreground rounded-xl hover:bg-brand-pink/6 hover:text-brand-pink transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-border mt-2">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-semibold rounded-xl hover:bg-accent transition-colors">
                    <User size={16} /> Profile
                  </Link>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-semibold rounded-xl hover:bg-accent transition-colors">
                    <Package size={16} /> My Orders
                  </Link>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="flex items-center gap-3 px-3 py-3 text-sm font-semibold text-destructive w-full rounded-xl hover:bg-destructive/5 transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <Button variant="secondary" className="w-full mt-2" asChild>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;

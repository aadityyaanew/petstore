import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Home', icon: Home, path: '/', match: (p) => p === '/' },
  { label: 'Shop', icon: ShoppingBag, path: '/products', match: (p) => p.startsWith('/products') || p.startsWith('/product/') },
  { label: 'Cart', icon: ShoppingCart, path: '/cart', match: (p) => p === '/cart' || p === '/checkout' },
  { label: 'Profile', icon: User, path: null, match: (p) => p === '/profile' || p === '/login' || p === '/orders' },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const { user } = useAuth();
  const cartCount = cart?.items?.length || 0;

  const handleNav = (item) => {
    if (item.label === 'Profile') {
      navigate(user ? '/profile' : '/login');
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] select-none safe-bottom"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.match(location.pathname);
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => handleNav(item)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full px-1 transition-all duration-200 cursor-pointer touch-manipulation active:scale-95",
                isActive ? "text-[#E050D0]" : "text-gray-400 hover:text-gray-900"
              )}
            >
              <div className="relative">
                <Icon
                  size={20}
                  className={cn("transition-transform duration-200", isActive && "scale-110")}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.label === 'Cart' && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-[#E050D0] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none px-1 shadow-sm">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] font-semibold leading-none mt-0.5",
                isActive ? "text-[#E050D0]" : "text-gray-500"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-[#E050D0] rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

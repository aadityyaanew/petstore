import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Image as ImageIcon, Store, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { text: 'Products', icon: <Package size={20} />, path: '/admin/products' },
    { text: 'Orders', icon: <ShoppingCart size={20} />, path: '/admin/orders' },
    { text: 'Users', icon: <Users size={20} />, path: '/admin/users' },
    { text: 'Coupons', icon: <Tag size={20} />, path: '/admin/coupons' },
    { text: 'Banners', icon: <ImageIcon size={20} />, path: '/admin/banners' },
    { text: 'Back to Store', icon: <Store size={20} />, path: '/' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-accent/20">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-border sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-pink text-white flex items-center justify-center shrink-0">
            <Store size={18} />
          </div>
          <span className="font-extrabold text-brand-pink tracking-wider uppercase text-sm">Poonch Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl border border-border hover:bg-accent text-foreground transition-colors"
          aria-label="Toggle admin menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Backdrop & Slide Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <aside className="relative w-64 max-w-[80vw] bg-white border-r border-border flex flex-col h-full z-50 shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-border">
              <span className="font-extrabold text-brand-pink tracking-widest uppercase text-sm">Admin Navigation</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="p-4 flex-1 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path) && item.path !== '/');
                return (
                  <Link
                    key={item.text}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                      isActive 
                        ? 'bg-brand-pink/10 text-brand-pink font-bold' 
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                    }`}
                  >
                    {item.icon}
                    {item.text}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-border flex-col shrink-0 min-h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-brand-pink text-white flex items-center justify-center">
            <Store size={18} />
          </div>
          <span className="font-extrabold text-brand-pink tracking-widest uppercase">Admin</span>
        </div>
        <nav className="p-4 flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path) && item.path !== '/');
            return (
              <Link
                key={item.text}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                  isActive 
                    ? 'bg-brand-pink/10 text-brand-pink font-bold' 
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                }`}
              >
                {item.icon}
                {item.text}
              </Link>
            );
          })}
        </nav>
      </aside>
      
      {/* Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto overflow-x-hidden w-full max-w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

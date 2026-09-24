import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Image as ImageIcon, Store } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

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
    <div className="flex min-h-screen bg-accent/20">
      <aside className="w-64 bg-white border-r border-border flex flex-col shrink-0">
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
      
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

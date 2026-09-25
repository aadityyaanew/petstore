import { useState, useEffect } from 'react';
import { TrendingUp, Package, ShoppingCart, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import api from '../../services/api';

const AdminDashboard = () => {
  const [data, setData] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    salesData: [],
    statusData: [],
    newUsersData: [],
    topProducts: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.getAnalyticsStats();
        if (res.data?.success) {
          const stats = res.data.data;
          setData({
            users: stats.totalUsers || 0,
            products: stats.totalProducts || 0,
            orders: stats.totalOrders || 0,
            revenue: stats.totalRevenue || 0,
            salesData: stats.salesData || [],
            statusData: stats.statusData || [],
            newUsersData: stats.newUsersData || [],
            topProducts: stats.topProducts || [],
            recentOrders: stats.recentOrders || []
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    api.getLowStockProducts()
      .then((res) => setLowStockProducts(res.data || []))
      .catch((e) => console.error('Low stock fetch failed:', e.message));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-32">
      <div className="w-12 h-12 border-4 border-brand-pink/20 border-t-brand-pink rounded-full animate-spin" />
    </div>
  );

  const statCards = [
    { title: 'Total Revenue', value: `₹${data.revenue.toFixed(2)}`, icon: <DollarSign size={24} className="text-white" />, gradient: 'bg-gradient-to-br from-emerald-400 to-teal-500' },
    { title: 'Total Orders', value: data.orders, icon: <ShoppingCart size={24} className="text-white" />, gradient: 'bg-gradient-to-br from-blue-400 to-cyan-500' },
    { title: 'Total Products', value: data.products, icon: <Package size={24} className="text-white" />, gradient: 'bg-gradient-to-br from-amber-400 to-orange-500' },
    { title: 'Total Users', value: data.users, icon: <Users size={24} className="text-white" />, gradient: 'bg-gradient-to-br from-purple-500 to-indigo-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="text-brand-pink" size={36} />
        <h1 className="text-4xl font-extrabold text-foreground">Analytics & Dashboard</h1>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className={`relative overflow-hidden rounded-3xl ${card.gradient} text-white p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all`}>
            <div className="absolute -right-4 -top-4 opacity-20 scale-[2.5]">
              {card.icon}
            </div>
            <div className="relative z-10">
              <p className="text-sm font-bold uppercase tracking-wider mb-2 opacity-90">{card.title}</p>
              <h2 className="text-4xl font-black">{card.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Low Stock Alert Panel */}
      {lowStockProducts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-amber-500" size={24} />
            <h2 className="text-xl font-bold">Low Stock Alerts</h2>
            <Badge variant="warning">{lowStockProducts.length} items</Badge>
          </div>
          <div className="bg-amber-50 rounded-2xl border border-amber-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-amber-900 border-b border-amber-200">
                  <tr>
                    <th className="px-6 py-3 font-bold">Product Name</th>
                    <th className="px-6 py-3 font-bold">Category</th>
                    <th className="px-6 py-3 font-bold">Stock</th>
                    <th className="px-6 py-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-200 text-amber-950">
                  {lowStockProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-amber-100/50">
                      <td className="px-6 py-3 font-semibold">{product.name}</td>
                      <td className="px-6 py-3">{product.category}</td>
                      <td className={`px-6 py-3 font-bold ${product.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                        {product.stock} (≤ {product.lowStockThreshold ?? 5})
                      </td>
                      <td className="px-6 py-3">
                        {product.stock === 0 ? (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-bold border border-red-200">Out of Stock</span>
                        ) : (
                          <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded-md text-xs font-bold">Low Stock</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-6 border-b border-border bg-accent/20">
            <h3 className="text-xl font-bold">Top Selling Products</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-accent/30 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-semibold">Product Name</th>
                  <th className="px-6 py-3 font-semibold text-right">Qty Sold</th>
                  <th className="px-6 py-3 font-semibold text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.topProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-accent/10">
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-right">
                      <Badge variant="outline">{product.quantity}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">₹{product.revenue.toFixed(2)}</td>
                  </tr>
                ))}
                {data.topProducts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">No products sold yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-6 border-b border-border bg-accent/20">
            <h3 className="text-xl font-bold">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-accent/30 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-semibold">Order ID</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Total</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-accent/10">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{order._id.substring(18)}</td>
                    <td className="px-6 py-4 font-medium">{order.user?.name || 'Guest'}</td>
                    <td className="px-6 py-4 font-bold">₹{order.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={order.status === 'delivered' ? 'success' : order.status === 'processing' ? 'warning' : order.status === 'shipped' ? 'default' : 'outline'} className="capitalize">
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {data.recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

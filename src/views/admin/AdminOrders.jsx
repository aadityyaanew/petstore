import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import api from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.getAllOrders();
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateOrderStatus(id, newStatus);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      alert(error.response?.data?.message || 'Error updating order');
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'processing': return 'warning';
      case 'confirmed': return 'info';
      case 'shipped': return 'default';
      case 'delivered': return 'success';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-brand-pink/20 border-t-brand-pink rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center">
          <ShoppingCart size={24} />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">Manage Orders</h1>
      </div>
      
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Payment</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{order._id.substring(18)}</td>
                  <td className="px-6 py-4 font-medium">{order.user?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-brand-pink">₹{order.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusVariant(order.status)} className="capitalize">
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="flex h-9 w-full min-w-[120px] rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="processing">Processing</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;

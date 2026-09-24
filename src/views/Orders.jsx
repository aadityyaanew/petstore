import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const res = await api.getMyOrders();
        setOrders(res.data || []);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-brand-pink/20 border-t-brand-pink rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-muted-foreground text-lg">You have not placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Order #{order._id}</p>
                    <p className="text-sm">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                      {order.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment'}
                    </Badge>
                    <Badge variant={order.status === 'delivered' ? 'secondary' : 'outline'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 border border-border rounded-xl bg-accent/20">
                      <img 
                        src={item.image || '/assets/asset-058339ca.jpeg'} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg shrink-0" 
                      />
                      <div>
                        <p className="font-semibold text-sm line-clamp-1">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.quantity} x ₹{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-border pt-4 text-right">
                  <p className="text-lg font-bold">
                    Total: <span className="text-brand-pink">₹{order.totalPrice.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

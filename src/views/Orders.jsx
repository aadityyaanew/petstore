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
    <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-border p-6">
          <p className="text-muted-foreground text-base sm:text-lg mb-4">You have not placed any orders yet.</p>
          <a href="/products" className="inline-block bg-brand-pink text-white font-bold px-6 py-2.5 rounded-full text-sm hover:bg-brand-pink/90">
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
                      Order <span className="font-mono break-all text-foreground font-bold">#{order._id}</span>
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      Placed on: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                      {order.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment'}
                    </Badge>
                    <Badge variant={order.status === 'delivered' ? 'secondary' : 'outline'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 border border-border rounded-xl bg-accent/20">
                      <img 
                        src={item.image || '/assets/asset-058339ca.jpeg'} 
                        alt={item.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg shrink-0" 
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-xs sm:text-sm truncate">{item.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{item.quantity} x ₹{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-border pt-3.5 sm:pt-4 flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-sm text-muted-foreground sm:hidden font-medium">Order Total:</span>
                  <p className="text-base sm:text-lg font-bold">
                    <span className="hidden sm:inline">Total: </span>
                    <span className="text-brand-pink">₹{order.totalPrice.toFixed(2)}</span>
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

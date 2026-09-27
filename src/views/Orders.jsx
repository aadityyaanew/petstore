import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';

import { getItemImageUrl } from '../components/ProductCard';

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
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-6 sm:py-10 space-y-6">
        <Skeleton className="h-9 w-48 mb-8" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border shadow-sm p-4 sm:p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
            <div className="flex justify-end pt-4">
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-border p-6">
          <p className="text-muted-foreground text-base sm:text-lg mb-4">You have not placed any orders yet.</p>
          <a href="/products" className="inline-block bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-full text-sm hover:bg-primary/90 transition-colors">
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
                        src={getItemImageUrl(item)} 
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
                
                <div className="border-t border-border pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
                  <button 
                    onClick={() => window.location.href = `/orders/${order._id}`}
                    className="text-sm font-semibold text-primary hover:underline px-4 py-2 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    View Details
                  </button>
                  <div className="flex items-center justify-between w-full sm:w-auto">
                    <span className="text-sm text-muted-foreground sm:hidden font-medium">Order Total:</span>
                    <p className="text-base sm:text-lg font-bold">
                      <span className="hidden sm:inline">Total: </span>
                      <span className="text-foreground">₹{order.totalPrice.toFixed(2)}</span>
                    </p>
                  </div>
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

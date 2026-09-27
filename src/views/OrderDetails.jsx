import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { getItemImageUrl } from '../components/ProductCard';
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
  Printer,
  ExternalLink,
  AlertCircle,
  XCircle,
  FileText,
  ShoppingBag
} from 'lucide-react';

const ORDER_STEPS = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'processing', label: 'Processing' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out for delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' }
];

const getStepIndex = (status) => {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'cancelled' || normalized === 'returned') return -1;
  const index = ORDER_STEPS.findIndex(step => step.key === normalized);
  if (index !== -1) return index;
  if (normalized === 'confirmed') return 1;
  return 0;
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getOrderById(id);
        setOrder(res.data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.response?.data?.message || 'Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
        <p className="text-muted-foreground mb-6">Please log in to view order details.</p>
        <Button onClick={() => navigate('/login')}>Go to Login</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-8 w-64 rounded-lg" />
        </div>
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <XCircle size={36} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">{error || 'Unable to retrieve information for this order.'}</p>
        <Link to="/orders">
          <Button className="gap-2">
            <ArrowLeft size={16} /> Back to My Orders
          </Button>
        </Link>
      </div>
    );
  }

  const currentStepIdx = getStepIndex(order.status);
  const isCancelled = order.status?.toLowerCase() === 'cancelled';
  const isReturned = order.status?.toLowerCase() === 'returned';

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'packed': return 'default';
      case 'shipped': return 'default';
      case 'out for delivery': return 'info';
      case 'delivered': return 'success';
      case 'returned': return 'destructive';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const handlePrintInvoice = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Invoice #${order._id.substring(Math.max(0, order._id.length - 8)).toUpperCase()}</title>
          <style>
            body { font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #111827; }
            h1 { color: #E050D0; margin-bottom: 5px; font-weight: 800; font-size: 28px; }
            .header { border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            .details-grid { display: flex; justify-content: space-between; margin-bottom: 40px; line-height: 1.6; }
            .details-col { flex: 1; }
            h3 { color: #4B5563; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #f9fafb; text-align: left; padding: 12px; border-bottom: 2px solid #e5e7eb; font-size: 14px; color: #4B5563; }
            td { padding: 14px 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
            .totals { width: 300px; float: right; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
            .grand-total { font-size: 18px; font-weight: 800; border-bottom: none; border-top: 2px solid #111827; padding-top: 12px; margin-top: 8px; }
            @media print { body { padding: 0; } @page { margin: 1cm; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Poonch Pet Store</h1>
              <p style="color: #6B7280; font-size: 14px;">Safe Play, Happy Tails & Feathered Friends</p>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0; font-size: 24px; color: #374151;">INVOICE</h2>
              <p style="margin: 4px 0 0 0; color: #6B7280;">#${order._id.substring(Math.max(0, order._id.length - 8)).toUpperCase()}</p>
            </div>
          </div>
          
          <div class="details-grid">
            <div class="details-col">
              <h3>Billed To:</h3>
              <p><strong>${order.shippingAddress?.fullName || user?.name || 'Customer'}</strong><br/>
              ${order.shippingAddress?.street || ''}<br/>
              ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.zipCode || ''}<br/>
              Phone: ${order.shippingAddress?.phone || 'N/A'}</p>
            </div>
            <div class="details-col" style="text-align: right;">
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              <p><strong>Status:</strong> <span style="text-transform: uppercase; font-weight: bold;">${order.status}</span></p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Price</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${(order.items || []).map(item => `
                <tr>
                  <td>
                    <strong>${item.name}</strong>
                  </td>
                  <td>₹${item.price.toFixed(2)}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">₹${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row"><span style="color: #6B7280;">Subtotal</span> <span>₹${(order.itemsPrice || 0).toFixed(2)}</span></div>
            <div class="totals-row"><span style="color: #6B7280;">Shipping</span> <span>₹${(order.shippingPrice || 0).toFixed(2)}</span></div>
            ${order.discountAmount > 0 ? `<div class="totals-row" style="color: #E050D0;"><span style="font-weight:bold;">Discount Applied</span> <span style="font-weight:bold;">-₹${order.discountAmount.toFixed(2)}</span></div>` : ''}
            <div class="totals-row grand-total"><span>Total Amount</span> <span>₹${(order.totalPrice || 0).toFixed(2)}</span></div>
          </div>
          
          <script>
            window.onload = () => { setTimeout(() => { window.print(); }, 500); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-6xl mx-auto px-3.5 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <button
            onClick={() => navigate('/orders')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft size={16} /> Back to My Orders
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Order Details
            </h1>
            <span className="font-mono text-sm sm:text-base font-bold text-muted-foreground bg-accent/60 px-3 py-1 rounded-lg">
              #{order._id}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={getStatusVariant(order.status)} className="text-sm px-3.5 py-1 capitalize">
            {order.status}
          </Badge>
          <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'} className="text-sm px-3.5 py-1 capitalize">
            {order.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
          </Badge>
          <Button variant="outline" size="sm" onClick={handlePrintInvoice} className="gap-2 ml-auto sm:ml-0">
            <Printer size={16} /> Print Invoice
          </Button>
        </div>
      </div>

      {/* Order Status Tracking Progress Bar */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-8">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Truck className="text-primary" size={20} /> Order Status Tracking
        </h2>

        {isCancelled ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-3">
            <XCircle size={24} className="shrink-0" />
            <div>
              <p className="font-bold text-base">This order has been cancelled.</p>
              <p className="text-sm">If you have questions regarding a refund or cancellation, please contact our support.</p>
            </div>
          </div>
        ) : isReturned ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle size={24} className="shrink-0" />
            <div>
              <p className="font-bold text-base">This order has been returned.</p>
              <p className="text-sm">The return process is complete. Contact support if you need further assistance.</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="hidden md:grid grid-cols-6 gap-2 text-center">
              {ORDER_STEPS.map((step, idx) => {
                const isCompleted = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;
                return (
                  <div key={step.key} className="flex flex-col items-center relative">
                    {/* Connector line */}
                    {idx < ORDER_STEPS.length - 1 && (
                      <div
                        className={`absolute top-4 left-[50%] w-full h-1 ${
                          currentStepIdx > idx ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                    {/* Circle Node */}
                    <div
                      className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        isCompleted
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                          : 'bg-muted text-muted-foreground'
                      } ${isCurrent ? 'scale-110 shadow-md' : ''}`}
                    >
                      {isCompleted ? <CheckCircle2 size={20} /> : idx + 1}
                    </div>
                    <span
                      className={`mt-3 text-xs sm:text-sm font-semibold capitalize ${
                        isCurrent
                          ? 'text-primary font-bold'
                          : isCompleted
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile Vertical Steps */}
            <div className="md:hidden space-y-4">
              {ORDER_STEPS.map((step, idx) => {
                const isCompleted = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCompleted
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <span
                      className={`text-sm font-semibold capitalize ${
                        isCurrent
                          ? 'text-primary font-bold'
                          : isCompleted
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Courier & Tracking Information */}
        {(order.courierPartner || order.trackingLink) && (
          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-accent/30 p-4 rounded-xl">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Shipment Details</p>
              {order.courierPartner && (
                <p className="text-sm font-medium">
                  Courier Partner: <span className="font-bold text-foreground">{order.courierPartner}</span>
                </p>
              )}
            </div>
            {order.trackingLink && (
              <a
                href={order.trackingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline bg-white border border-border px-4 py-2 rounded-xl shadow-sm hover:bg-accent transition-colors"
              >
                Track Package <ExternalLink size={15} />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-border pb-3">
              <Package size={20} className="text-primary" /> Items in Order ({order.items?.length || 0})
            </h2>

            <div className="divide-y divide-border">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-border overflow-hidden bg-accent/20 shrink-0">
                    <img
                      src={getItemImageUrl(item)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={item.product ? `/product/${item.product}` : '#'}
                      className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Unit Price: ₹{(item.price || 0).toFixed(2)} | Quantity: <span className="font-semibold text-foreground">{item.quantity}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-extrabold text-sm sm:text-base text-foreground">
                      ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Delivery Address */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-border pb-3">
              <MapPin size={20} className="text-primary" /> Delivery Address
            </h2>
            {order.shippingAddress ? (
              <div className="space-y-2 text-sm">
                <p className="font-bold text-base text-foreground">{order.shippingAddress.fullName}</p>
                <p className="text-muted-foreground">{order.shippingAddress.street}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                </p>
                <p className="text-muted-foreground">{order.shippingAddress.country || 'India'}</p>
                <p className="text-muted-foreground pt-2 font-medium">
                  Phone: <span className="font-semibold text-foreground">{order.shippingAddress.phone}</span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No shipping address recorded.</p>
            )}
          </div>
        </div>

        {/* Right Column: Order & Payment Summary */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-6">
            <h2 className="text-lg font-bold mb-4 border-b border-border pb-3">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Items Subtotal</span>
                <span className="font-semibold text-foreground">₹{(order.itemsPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping Fee</span>
                <span className="font-semibold text-foreground">
                  {order.shippingPrice > 0 ? `₹${order.shippingPrice.toFixed(2)}` : 'FREE'}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                  <span>-₹{order.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border pt-3 flex justify-between font-extrabold text-lg text-foreground">
                <span>Total</span>
                <span className="text-primary">₹{(order.totalPrice || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-border pb-3">
              <CreditCard size={20} className="text-primary" /> Payment Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-bold text-foreground">{order.paymentMethod || 'COD'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                  {order.paymentStatus}
                </Badge>
              </div>
              {order.razorpayPaymentId && (
                <div className="pt-2 border-t border-border space-y-1">
                  <span className="text-xs text-muted-foreground block font-semibold">Transaction ID</span>
                  <span className="font-mono text-xs text-foreground bg-accent/50 p-2 rounded block break-all">
                    {order.razorpayPaymentId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-6 space-y-3">
            <Link to="/products" className="block">
              <Button variant="secondary" className="w-full gap-2">
                <ShoppingBag size={16} /> Continue Shopping
              </Button>
            </Link>
            <Link to="/orders" className="block">
              <Button variant="outline" className="w-full gap-2">
                <FileText size={16} /> View All Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
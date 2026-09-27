import React, { useState, useEffect } from 'react';
import { ShoppingCart, ChevronDown, ChevronUp, Package, Truck, User, CreditCard, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Skeleton } from '../../components/ui/skeleton';
import api, { BASE_URL } from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  
  // State for updating order
  const [updateData, setUpdateData] = useState({
    status: '',
    courierPartner: '',
    trackingLink: ''
  });
  const [updating, setUpdating] = useState(false);

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

  const handleExpand = (order) => {
    if (expandedId === order._id) {
      setExpandedId(null);
    } else {
      setExpandedId(order._id);
      setUpdateData({
        status: order.status,
        courierPartner: order.courierPartner || '',
        trackingLink: order.trackingLink || ''
      });
    }
  };

  const handleUpdate = async (id) => {
    setUpdating(true);
    try {
      await api.updateOrderStatus(id, updateData);
      await fetchOrders();
      alert('Order updated successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
      alert(error.response?.data?.message || 'Error updating order');
    } finally {
      setUpdating(false);
    }
  };

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

  const handlePrintOrder = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Invoice #${order._id.substring(18).toUpperCase()}</title>
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
              <p style="margin: 4px 0 0 0; color: #6B7280;">#${order._id.substring(18).toUpperCase()}</p>
            </div>
          </div>
          
          <div class="details-grid">
            <div class="details-col">
              <h3>Billed To:</h3>
              <p><strong>${order.shippingAddress?.fullName || order.user?.name || 'Customer'}</strong><br/>
              ${order.shippingAddress?.street || 'No street provided'}<br/>
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
              ${order.items.map(item => `
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
            <div class="totals-row"><span style="color: #6B7280;">Subtotal</span> <span>₹${order.itemsPrice?.toFixed(2)}</span></div>
            <div class="totals-row"><span style="color: #6B7280;">Shipping</span> <span>₹${order.shippingPrice?.toFixed(2)}</span></div>
            ${order.discountAmount > 0 ? `<div class="totals-row" style="color: #E050D0;"><span style="font-weight:bold;">Discount Applied</span> <span style="font-weight:bold;">-₹${order.discountAmount?.toFixed(2)}</span></div>` : ''}
            <div class="totals-row grand-total"><span>Total Amount</span> <span>₹${order.totalPrice?.toFixed(2)}</span></div>
          </div>
          
          <script>
            window.onload = () => { setTimeout(() => { window.print(); }, 500); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const STATUS_OPTIONS = [
    'Pending', 'Processing', 'Packed', 'Shipped', 
    'Out for Delivery', 'Delivered', 'Returned', 'Cancelled'
  ];

  if (loading) return (
    <div className="max-w-7xl mx-auto pb-12 space-y-8">
      <Skeleton className="h-12 w-64 mb-8" />
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-8 w-28 ml-auto rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-12">
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
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className={`hover:bg-accent/30 transition-colors ${expandedId === order._id ? 'bg-accent/20' : ''}`}>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">#{order._id.substring(18).toUpperCase()}</td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium">{order.shippingAddress?.fullName || order.user?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 font-bold text-brand-pink">₹{order.totalPrice?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusVariant(order.status)} className="capitalize">
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => handleExpand(order)} className="gap-2">
                        {expandedId === order._id ? (
                          <><ChevronUp size={16} /> Hide Details</>
                        ) : (
                          <><ChevronDown size={16} /> View Details</>
                        )}
                      </Button>
                    </td>
                  </tr>

                  {/* EXPANDED ROW DETAILS */}
                  {expandedId === order._id && (
                    <tr>
                      <td colSpan={6} className="p-0 border-b-4 border-brand-pink/20">
                        <div className="bg-gray-50/50 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 shadow-inner">
                          
                          {/* Column 1: Order Info & Shipping */}
                          <div className="space-y-6">
                            <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
                              <h3 className="font-bold flex items-center gap-2 mb-4 border-b border-border pb-3">
                                <User size={18} className="text-brand-pink" /> Customer & Shipping
                              </h3>
                              <div className="space-y-3 text-sm">
                                <p><span className="text-muted-foreground font-semibold">Name:</span> {order.shippingAddress?.fullName}</p>
                                <p><span className="text-muted-foreground font-semibold">Phone:</span> {order.shippingAddress?.phone}</p>
                                <p><span className="text-muted-foreground font-semibold">Address:</span> {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}</p>
                              </div>
                            </div>
                            
                            <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
                              <h3 className="font-bold flex items-center gap-2 mb-4 border-b border-border pb-3">
                                <CreditCard size={18} className="text-brand-pink" /> Payment Details
                              </h3>
                              <div className="space-y-3 text-sm">
                                <p className="flex justify-between">
                                  <span className="text-muted-foreground font-semibold">Method:</span> 
                                  <span>{order.paymentMethod}</span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="text-muted-foreground font-semibold">Status:</span> 
                                  <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>{order.paymentStatus}</Badge>
                                </p>
                                {order.razorpayPaymentId && (
                                  <p className="flex flex-col mt-2 pt-2 border-t border-border/50">
                                    <span className="text-muted-foreground font-semibold mb-1">Transaction ID:</span> 
                                    <span className="font-mono text-xs">{order.razorpayPaymentId}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Column 2: Products List */}
                          <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
                            <h3 className="font-bold flex items-center gap-2 mb-4 border-b border-border pb-3">
                              <Package size={18} className="text-brand-pink" /> Products Ordered
                            </h3>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-center">
                                  <div className="w-16 h-16 rounded-md border border-border overflow-hidden flex-shrink-0 bg-gray-50">
                                    {item.image ? (
                                      <img src={item.image.startsWith('http') ? item.image : `${BASE_URL}${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <Package className="w-full h-full p-4 text-gray-300" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm line-clamp-2">{item.name}</h4>
                                    <div className="flex items-center justify-between mt-1 text-sm text-muted-foreground">
                                      <span>Qty: {item.quantity}</span>
                                      <span className="font-bold text-foreground">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
                              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal:</span> <span>₹{order.itemsPrice?.toFixed(2)}</span></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">Shipping:</span> <span>₹{order.shippingPrice?.toFixed(2)}</span></div>
                              {order.discountAmount > 0 && (
                                <div className="flex justify-between text-brand-pink"><span className="font-semibold">Discount:</span> <span>-₹{order.discountAmount?.toFixed(2)}</span></div>
                              )}
                              <div className="flex justify-between font-bold text-lg pt-2 border-t border-border"><span>Total:</span> <span>₹{order.totalPrice?.toFixed(2)}</span></div>
                            </div>
                          </div>

                          {/* Column 3: Update Status & Shipping */}
                          <div className="bg-white p-5 rounded-xl border border-border shadow-sm border-t-4 border-t-blue-500 flex flex-col justify-between">
                            <div>
                              <h3 className="font-bold flex items-center gap-2 mb-4 border-b border-border pb-3">
                                <Truck size={18} className="text-blue-500" /> Update Tracking & Status
                              </h3>
                            <div className="space-y-4">
                              <div className="space-y-1.5">
                                <label className="text-sm font-semibold">Order Status</label>
                                <select
                                  value={updateData.status}
                                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                  {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-sm font-semibold">Courier Partner</label>
                                <Input 
                                  value={updateData.courierPartner} 
                                  onChange={(e) => setUpdateData({ ...updateData, courierPartner: e.target.value })}
                                  placeholder="e.g. Delhivery, BlueDart" 
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-sm font-semibold">Tracking Link</label>
                                <Input 
                                  value={updateData.trackingLink} 
                                  onChange={(e) => setUpdateData({ ...updateData, trackingLink: e.target.value })}
                                  placeholder="https://..." 
                                />
                              </div>
                              
                              <Button 
                                onClick={() => handleUpdate(order._id)} 
                                disabled={updating}
                                className="w-full gap-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                {updating ? 'Updating...' : <><CheckCircle2 size={18} /> Save Updates</>}
                              </Button>

                              {order.trackingLink && (
                                <a href={order.trackingLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 mt-4 text-sm text-blue-600 hover:underline">
                                  <ExternalLink size={14} /> Open Current Tracking Link
                                </a>
                              )}
                            </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-border/60">
                              <Button 
                                variant="outline" 
                                onClick={() => handlePrintOrder(order)}
                                className="w-full gap-2 border-dashed border-2 hover:bg-accent/50 hover:text-brand-pink transition-all font-bold"
                              >
                                <ExternalLink size={16} /> Print Order Invoice
                              </Button>
                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">
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

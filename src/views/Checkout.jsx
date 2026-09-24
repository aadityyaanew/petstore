import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const STEPS = ['Shipping Address', 'Payment Details'];

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, emptyCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'Card',
  });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const calculateTotal = () => {
    return cart?.items?.reduce((acc, item) => acc + item.product.price * item.quantity, 0) || 0;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponError('');
    try {
      const { data } = await api.applyCoupon({ code: couponCode, cartTotal: calculateTotal() });
      setAppliedCoupon(data);
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Invalid coupon');
      setAppliedCoupon(null);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const itemsPrice = calculateTotal();
      const shippingPrice = itemsPrice > 100 ? 0 : 10;
      const discountAmount = appliedCoupon?.discountAmount || 0;
      const totalPrice = itemsPrice + shippingPrice - discountAmount;

      const orderData = {
        items: cart.items.map(i => ({
          product: i.product._id,
          name: i.product.name,
          image: i.product.images[0] || '',
          price: i.product.price,
          quantity: i.quantity,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone,
          country: 'India',
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice,
        shippingPrice,
        couponCode: appliedCoupon?.code || '',
        discountAmount,
        totalPrice,
      };

      const { data } = await api.placeOrder(orderData);
      
      if (data.razorpayOrderId) {
        const keyData = await api.getRazorpayKey();
        
        const options = {
          key: keyData.data.key,
          amount: data.amount,
          currency: data.currency,
          name: 'E-commerce App',
          description: 'Order Payment',
          order_id: data.razorpayOrderId,
          handler: async function (response) {
            try {
              await api.verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              await emptyCart();
              navigate('/order-success');
            } catch (err) {
              alert('Payment verification failed.');
              navigate('/orders'); 
            }
          },
          prefill: {
            name: formData.fullName,
            email: user?.email || '',
            contact: formData.phone,
          },
          theme: {
            color: '#1976d2',
          },
          modal: {
            ondismiss: function() {
              alert('Payment cancelled. Your order is pending.');
              navigate('/orders');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
          alert('Payment Failed! ' + response.error.description);
        });
        rzp.open();
      } else {
        await emptyCart();
        navigate('/order-success');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.response?.data?.message || 'Error placing order');
    }
  };

  if (!cart?.items?.length) {
    return (
      <div className="py-20 text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty.</h2>
        <Button onClick={() => navigate('/')} variant="secondary">Go Shopping</Button>
      </div>
    );
  }

  const itemsPrice = calculateTotal();
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const discountAmount = appliedCoupon?.discountAmount || 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-center mb-8">Checkout</h1>
      
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {STEPS.map((label, index) => (
            <div key={label} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${activeStep >= index ? 'border-brand-pink bg-brand-pink text-white' : 'border-border text-muted-foreground'}`}>
                {index + 1}
              </div>
              <span className={`ml-2 text-sm font-medium ${activeStep >= index ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
              {index < STEPS.length - 1 && <div className="w-10 h-0.5 mx-4 bg-border" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">
            {activeStep === 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-semibold">Full Name</label>
                    <Input name="fullName" value={formData.fullName} onChange={handleChange} />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-semibold">Street Address</label>
                    <Input name="street" value={formData.street} onChange={handleChange} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">City</label>
                    <Input name="city" value={formData.city} onChange={handleChange} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">State</label>
                    <Input name="state" value={formData.state} onChange={handleChange} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">ZIP Code</label>
                    <Input name="zipCode" value={formData.zipCode} onChange={handleChange} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Phone Number</label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {['Card', 'UPI', 'COD'].map((method) => (
                    <label key={method} className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-accent/50 transition-colors">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={method} 
                        checked={formData.paymentMethod === method}
                        onChange={handleChange}
                        className="w-4 h-4 text-brand-pink focus:ring-brand-pink"
                      />
                      <span className="font-medium">
                        {method === 'Card' ? 'Credit / Debit Card' : method === 'UPI' ? 'UPI' : 'Cash on Delivery (COD)'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
              <Button disabled={activeStep === 0} onClick={handleBack} variant="outline">
                Back
              </Button>
              {activeStep === STEPS.length - 1 ? (
                <Button onClick={handlePlaceOrder} variant="secondary" size="lg">
                  Place Order
                </Button>
              ) : (
                <Button onClick={handleNext} variant="secondary">
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-accent/20 rounded-2xl border border-border p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
              {cart.items.map((item) => (
                <div key={item.product._id} className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground truncate pr-2">
                    {item.product.name} (x{item.quantity})
                  </p>
                  <p className="text-sm font-semibold shrink-0">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 text-sm border-t border-border pt-4 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">₹{itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-medium">₹{shippingPrice.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount ({appliedCoupon.code}):</span>
                  <span>-₹{appliedCoupon.discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-border mb-6">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-2xl font-extrabold text-brand-pink">
                ₹{(itemsPrice + shippingPrice - discountAmount).toFixed(2)}
              </span>
            </div>

            <div className="pt-4 border-t border-dashed border-border">
              <p className="text-sm font-bold mb-2">Have a Coupon?</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter code" 
                  value={couponCode} 
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={!!appliedCoupon}
                  className="uppercase"
                />
                <Button 
                  variant={appliedCoupon ? "destructive" : "default"}
                  onClick={appliedCoupon ? () => { setAppliedCoupon(null); setCouponCode(''); } : handleApplyCoupon}
                >
                  {appliedCoupon ? 'Remove' : 'Apply'}
                </Button>
              </div>
              {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

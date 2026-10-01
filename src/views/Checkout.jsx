import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { getItemImageUrl } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';

const STEPS = ['Shipping Address', 'Payment Details'];

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, emptyCart, loading: cartLoading } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  
  const defaultAddressIdx = user?.addresses?.length > 0 
    ? Math.max(0, user.addresses.findIndex(a => a.isDefault)) 
    : -1;
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(defaultAddressIdx);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    paymentMethod: 'Card',
  });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (selectedAddressIndex === -1) {
        if (!formData.fullName || !formData.street || !formData.city || !formData.state || !formData.pincode || !formData.phone) {
          return alert('Please fill all address fields.');
        }
      }
    }
    setActiveStep((prev) => prev + 1);
  };
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
      let shippingPrice = 0;
      if (itemsPrice <= 100) {
        shippingPrice = cart.items.reduce((acc, item) => {
          const product = item.product?._id ? item.product : item; // Fallback just in case
          if (product && !product.shipping?.freeShipping) {
            const charge = Number(product.shipping?.shippingCharge);
            return acc + (isNaN(charge) || charge === 0 ? 10 : charge) * item.quantity;
          }
          return acc;
        }, 0);
      }
      const discountAmount = appliedCoupon?.discountAmount || 0;
      const totalPrice = itemsPrice + shippingPrice - discountAmount;

      const isNewAddress = selectedAddressIndex === -1;
      const selectedAddress = user?.addresses?.[selectedAddressIndex] || {};

      const orderData = {
        items: cart.items.map(i => ({
          product: i.product?._id || i.product,
          name: i.product?.name || i.name || 'Pet Product',
          image: getItemImageUrl(i),
          price: i.product?.price ?? i.price ?? 0,
          quantity: i.quantity,
        })),
        shippingAddress: {
          fullName: isNewAddress ? formData.fullName : selectedAddress.fullName,
          street: isNewAddress ? formData.street : selectedAddress.street,
          city: isNewAddress ? formData.city : selectedAddress.city,
          state: isNewAddress ? formData.state : selectedAddress.state,
          zipCode: isNewAddress ? formData.pincode : selectedAddress.pincode,
          phone: isNewAddress ? formData.phone : selectedAddress.phone,
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

  if (cartLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-10 w-48 mx-auto mb-8" />
        <Skeleton className="h-10 w-full max-w-md mx-auto mb-8 rounded-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="py-20 text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty.</h2>
        <Button onClick={() => navigate('/')} variant="secondary">Go Shopping</Button>
      </div>
    );
  }

  const itemsPrice = calculateTotal();
  let shippingPrice = 0;
  if (itemsPrice <= 100) {
    shippingPrice = cart.items.reduce((acc, item) => {
      const product = item.product?._id ? item.product : item;
      if (product && !product.shipping?.freeShipping) {
        const charge = Number(product.shipping?.shippingCharge);
        return acc + (isNaN(charge) || charge === 0 ? 10 : charge) * item.quantity;
      }
      return acc;
    }, 0);
  }
  const discountAmount = appliedCoupon?.discountAmount || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-center mb-8">Checkout</h1>
      
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="flex items-center gap-1 xs:gap-2 sm:gap-4 max-w-full overflow-x-auto">
          {STEPS.map((label, index) => (
            <div key={label} className="flex items-center">
              <div className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 text-xs sm:text-sm font-bold shrink-0 ${activeStep >= index ? 'border-[#E050D0] bg-[#E050D0] text-white' : 'border-border text-muted-foreground'}`}>
                {index + 1}
              </div>
              <span className={`ml-1.5 sm:ml-2 text-xs sm:text-sm font-semibold whitespace-nowrap ${activeStep >= index ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
              {index < STEPS.length - 1 && <div className="w-6 xs:w-8 sm:w-10 h-0.5 mx-1.5 xs:mx-2 sm:mx-4 bg-border shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-4 xs:p-6 sm:p-8">
            {activeStep === 0 && (
              <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Shipping Address</h2>
                
                {/* Saved Addresses List */}
                {user?.addresses?.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {user.addresses.map((addr, idx) => (
                      <label key={idx} className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${selectedAddressIndex === idx ? 'border-brand-pink bg-brand-pink/5' : 'border-border hover:bg-gray-50'}`}>
                        <input 
                          type="radio" 
                          name="savedAddress" 
                          checked={selectedAddressIndex === idx}
                          onChange={() => setSelectedAddressIndex(idx)}
                          className="mt-1 w-4 h-4 text-brand-pink focus:ring-brand-pink"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{addr.fullName} {addr.isDefault && <span className="ml-2 text-[10px] bg-gray-200 px-2 py-0.5 rounded-full uppercase tracking-wider text-gray-600">Default</span>}</h4>
                          <p className="text-sm text-gray-600 mt-0.5">{addr.street}</p>
                          <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.pincode}</p>
                          <p className="text-sm font-semibold text-gray-700 mt-1">Phone: {addr.phone}</p>
                        </div>
                      </label>
                    ))}
                    <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${selectedAddressIndex === -1 ? 'border-brand-pink bg-brand-pink/5' : 'border-border hover:bg-gray-50'}`}>
                      <input 
                        type="radio" 
                        name="savedAddress" 
                        checked={selectedAddressIndex === -1}
                        onChange={() => setSelectedAddressIndex(-1)}
                        className="w-4 h-4 text-brand-pink focus:ring-brand-pink"
                      />
                      <span className="font-bold text-gray-900">Use a different address</span>
                    </label>
                  </div>
                )}

                {selectedAddressIndex === -1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-5 bg-gray-50 rounded-xl border border-border">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs sm:text-sm font-semibold">Full Name</label>
                      <Input name="fullName" value={formData.fullName} onChange={handleChange} required className="bg-white" />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs sm:text-sm font-semibold">Street Address / Locality</label>
                      <Input name="street" value={formData.street} onChange={handleChange} required className="bg-white" placeholder="House No, Building, Street" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold">Pincode</label>
                      <Input name="pincode" value={formData.pincode} onChange={handleChange} required className="bg-white" placeholder="6 digits" pattern="[0-9]{6}" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold">City</label>
                      <Input name="city" value={formData.city} onChange={handleChange} required className="bg-white" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold">State</label>
                      <select 
                        name="state" 
                        value={formData.state} 
                        onChange={handleChange} 
                        required 
                        className="w-full h-10 px-3 py-2 rounded-md border border-input bg-white text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="" disabled>Select State</option>
                        {INDIAN_STATES.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs sm:text-sm font-semibold">Phone Number</label>
                      <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} required className="bg-white" placeholder="10 digits" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { value: 'Card', label: 'Razorpay Secure (UPI, Card, Int\'l Card, Apple Pay)' },
                    { value: 'COD', label: 'Cash on Delivery (COD)' }
                  ].map((method) => (
                    <label key={method.value} className="flex items-center gap-3 p-3.5 sm:p-4 border border-border rounded-xl cursor-pointer hover:bg-accent/50 transition-colors">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={method.value} 
                        checked={formData.paymentMethod === method.value}
                        onChange={handleChange}
                        className="w-4 h-4 text-[#E050D0] focus:ring-[#E050D0]"
                      />
                      <span className="font-medium text-sm sm:text-base">
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-border">
              <Button disabled={activeStep === 0} onClick={handleBack} variant="outline" className="px-5 py-2 rounded-full cursor-pointer">
                Back
              </Button>
              {activeStep === STEPS.length - 1 ? (
                <Button onClick={handlePlaceOrder} variant="secondary" size="lg" className="px-6 py-2 rounded-full font-bold cursor-pointer">
                  Place Order
                </Button>
              ) : (
                <Button onClick={handleNext} variant="secondary" className="px-6 py-2 rounded-full font-bold cursor-pointer">
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-accent/20 rounded-2xl border border-border p-5 sm:p-6 sticky top-24 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-5 sm:mb-6 max-h-56 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div key={item.product._id} className="flex justify-between items-center text-xs sm:text-sm">
                  <p className="text-muted-foreground truncate pr-2">
                    {item.product.name} (x{item.quantity})
                  </p>
                  <p className="font-semibold shrink-0">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 text-xs sm:text-sm border-t border-border pt-4 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">₹{itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-medium">{shippingPrice === 0 ? 'Free' : `₹${shippingPrice.toFixed(2)}`}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount ({appliedCoupon.code}):</span>
                  <span>-₹{appliedCoupon.discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-border mb-5 sm:mb-6">
              <span className="text-base sm:text-lg font-bold">Total:</span>
              <span className="text-xl sm:text-2xl font-extrabold text-brand-pink">
                ₹{(itemsPrice + shippingPrice - discountAmount).toFixed(2)}
              </span>
            </div>

            <div className="pt-4 border-t border-dashed border-border">
              <p className="text-xs sm:text-sm font-bold mb-2">Have a Coupon?</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter code" 
                  value={couponCode} 
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={!!appliedCoupon}
                  className="uppercase text-xs sm:text-sm"
                />
                <Button 
                  variant={appliedCoupon ? "destructive" : "default"}
                  onClick={appliedCoupon ? () => { setAppliedCoupon(null); setCouponCode(''); } : handleApplyCoupon}
                  className="text-xs cursor-pointer rounded-xl"
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

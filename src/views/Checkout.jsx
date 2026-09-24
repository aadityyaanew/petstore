import { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Grid, Stepper, Step, StepLabel, RadioGroup, FormControlLabel, Radio, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const steps = ['Shipping Address', 'Payment Details'];

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
        // Razorpay flow for Card / UPI
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
              navigate('/orders'); // Take to orders page so they can retry or see pending order
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
        // COD flow
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
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Your cart is empty.</Typography>
        <Button onClick={() => navigate('/')} variant="contained" sx={{ mt: 2 }}>Go Shopping</Button>
      </Box>
    );
  }

  const itemsPrice = calculateTotal();
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const discountAmount = appliedCoupon?.discountAmount || 0;

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, textAlign: 'center' }}>Checkout</Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 4 }}>
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Shipping Address</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}><TextField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} fullWidth /></Grid>
                    <Grid item xs={12}><TextField label="Street Address" name="street" value={formData.street} onChange={handleChange} fullWidth /></Grid>
                    <Grid item xs={6}><TextField label="City" name="city" value={formData.city} onChange={handleChange} fullWidth /></Grid>
                    <Grid item xs={6}><TextField label="State" name="state" value={formData.state} onChange={handleChange} fullWidth /></Grid>
                    <Grid item xs={6}><TextField label="ZIP Code" name="zipCode" value={formData.zipCode} onChange={handleChange} fullWidth /></Grid>
                    <Grid item xs={6}><TextField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} fullWidth /></Grid>
                  </Grid>
                </Box>
              )}

              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Payment Method</Typography>
                  <RadioGroup name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                    <FormControlLabel value="Card" control={<Radio />} label="Credit / Debit Card" />
                    <FormControlLabel value="UPI" control={<Radio />} label="UPI" />
                    <FormControlLabel value="COD" control={<Radio />} label="Cash on Delivery (COD)" />
                  </RadioGroup>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">Back</Button>
                {activeStep === steps.length - 1 ? (
                  <Button variant="contained" color="primary" onClick={handlePlaceOrder} sx={{ px: 4, py: 1, borderRadius: '8px', fontSize: '1.1rem' }}>
                    Place Order
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleNext}>Next</Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '16px', bgcolor: '#f8f9fa', boxShadow: 'none', border: '1px solid rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Order Summary</Typography>
              {cart.items.map((item) => (
                <Box key={item.product._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {item.product.name} (x{item.quantity})
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Subtotal:</Typography>
                <Typography variant="body1">₹{itemsPrice.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Shipping:</Typography>
                <Typography variant="body1">₹{shippingPrice.toFixed(2)}</Typography>
              </Box>
              {appliedCoupon && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" color="success.main">Discount ({appliedCoupon.code}):</Typography>
                  <Typography variant="body1" color="success.main">-₹{appliedCoupon.discountAmount.toFixed(2)}</Typography>
                </Box>
              )}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Total:</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  ₹{(itemsPrice + shippingPrice - discountAmount).toFixed(2)}
                </Typography>
              </Box>

              {/* Coupon Section */}
              <Box sx={{ mt: 4, pt: 3, borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Have a Coupon?</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField 
                    size="small" 
                    placeholder="Enter code" 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!appliedCoupon}
                    fullWidth
                    inputProps={{ style: { textTransform: 'uppercase' } }}
                  />
                  <Button 
                    variant={appliedCoupon ? "outlined" : "contained"}
                    color={appliedCoupon ? "error" : "primary"}
                    onClick={appliedCoupon ? () => { setAppliedCoupon(null); setCouponCode(''); } : handleApplyCoupon}
                    disableElevation
                  >
                    {appliedCoupon ? 'Remove' : 'Apply'}
                  </Button>
                </Box>
                {couponError && <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>{couponError}</Typography>}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Checkout;

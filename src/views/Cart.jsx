import { Box, Container, Typography, Grid, Card, CardContent, Divider, Button, IconButton, CircularProgress } from '@mui/material';
import { Add, Remove, DeleteOutline, ArrowForward } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useState } from 'react';

const Cart = () => {
  const { cart, loading: cartLoading, updateCartItem, removeFromCart, emptyCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  const cartItems = cart?.items || [];
  const subtotal = cart?.totalPrice || 0;
  // Let the backend calculate exact total, but visually we can show static tax/shipping for demo
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleUpdateQuantity = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    await updateCartItem(productId, newQuantity);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!user) {
    return (
      <Container sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Please sign in to view your cart</Typography>
        <Button component={Link} to="/login" variant="contained">Sign In</Button>
      </Container>
    );
  }

  if (cartLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 4 }}>
        Shopping Cart
      </Typography>
      
      {cartItems.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>Your cart is empty.</Typography>
          <Button component={Link} to="/" variant="contained" size="large">Start Shopping</Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {cartItems.map((item) => {
                const product = item.product || {};
                return (
                  <Card key={item._id || Object.toString(product._id)} sx={{ display: 'flex', p: 2, borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                    <Box 
                      component="img" 
                      src={product.image || 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=200&h=200&fit=crop'} 
                      sx={{ width: { xs: 80, sm: 120 }, height: { xs: 80, sm: 120 }, objectFit: 'cover', borderRadius: '12px', flexShrink: 0 }} 
                    />
                    <CardContent sx={{ flexGrow: 1, py: 0, px: { xs: 1, sm: 2 }, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{product.name || item.name || 'Product'}</Typography>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>₹{(item.price * item.quantity).toFixed(2)}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 'auto' }}>
                        Unit Price: ₹{item.price.toFixed(2)}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0', borderRadius: '8px', bgcolor: '#F8FAFC' }}>
                          <IconButton size="small" onClick={() => handleUpdateQuantity(product._id || item.product, item.quantity, -1)}>
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography sx={{ px: { xs: 1, sm: 2 }, fontWeight: 600 }}>{item.quantity}</Typography>
                          <IconButton size="small" onClick={() => handleUpdateQuantity(product._id || item.product, item.quantity, 1)}>
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>
                        <IconButton color="error" size="small" onClick={() => removeFromCart(product._id || item.product)}>
                          <DeleteOutline />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: '24px', p: 3, bgcolor: '#0F172A', color: 'white', position: 'sticky', top: 100 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Order Summary</Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Subtotal</Typography>
                <Typography sx={{ fontWeight: 600 }}>₹{subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Shipping</Typography>
                <Typography sx={{ fontWeight: 600 }}>Free</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Estimated Tax</Typography>
                <Typography sx={{ fontWeight: 600 }}>₹{tax.toFixed(2)}</Typography>
              </Box>
              
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#3B82F6' }}>₹{total.toFixed(2)}</Typography>
              </Box>
              
              <Button 
                variant="contained" 
                color="secondary" 
                fullWidth 
                size="large"
                endIcon={<ArrowForward />}
                onClick={handleCheckout}
                disabled={checkingOut}
                sx={{ py: 1.5, borderRadius: '12px', fontSize: '1.1rem', color: 'white' }}
              >
                {checkingOut ? 'Processing...' : 'Secure Checkout'}
              </Button>
              
              <Button 
                component={Link} 
                to="/"
                variant="text" 
                fullWidth 
                sx={{ mt: 2, color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}
              >
                Continue Shopping
              </Button>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Cart;

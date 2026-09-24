import { Box, Container, Grid, Typography, Button, IconButton, Divider, Chip, Rating, CircularProgress, Alert } from '@mui/material';
import { Add, Remove, ShoppingCart, LocalShipping, Security, ErrorOutline, CheckCircle } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.getProductById(id);
        setProduct(res.data);
      } catch (error) {
        console.error('Failed to fetch product details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
      // Optional: show success toast or open cart drawer
    } catch (error) {
      console.error('Failed to add to cart', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setReviewLoading(true);
    setReviewMessage('');
    try {
      await api.addReview(id, { rating, comment });
      setReviewMessage('Review added successfully!');
      setRating(5);
      setComment('');
      // Refetch product to show new review
      const res = await api.getProductById(id);
      setProduct(res.data);
    } catch (error) {
      setReviewMessage(error.response?.data?.message || 'Error adding review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress /></Box>;
  if (!product) return <Typography align="center" sx={{ py: 12 }}>Product not found</Typography>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={6}>
        {/* Image Gallery */}
        <Grid item xs={12} md={6}>
          <Box 
            sx={{ 
              bgcolor: 'white', 
              borderRadius: '24px', 
              overflow: 'hidden', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              border: '1px solid #E2E8F0',
              p: 4
            }}
          >
            <Box 
              component="img" 
              src={product.images?.[0] || ''} 
              alt={product.name}
              sx={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: 600, display: 'block', margin: '0 auto' }}
            />
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ mb: 2 }}>
              <Chip label={product.category} color="primary" variant="outlined" size="small" sx={{ mb: 2, fontWeight: 600 }} />
              <Typography variant="h2" component="h1" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
                {product.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Rating value={product.rating || 0} precision={0.1} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  ({product.numReviews || 0} reviews)
                </Typography>
              </Box>
              <Typography variant="h3" color="primary.main" sx={{ fontWeight: 800, mb: 3 }}>
                ₹{product.price.toFixed(2)}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.7, mb: 4 }}>
                {product.description}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Stock status display */}
            <Box sx={{ mb: 3 }}>
              {product.stock === 0 ? (
                <Chip
                  icon={<ErrorOutline />}
                  label="Out of Stock"
                  sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 700, fontSize: '0.9rem', px: 1, py: 2.5 }}
                />
              ) : product.stock <= (product.lowStockThreshold ?? 5) ? (
                <Alert
                  severity="warning"
                  sx={{ borderRadius: '12px', fontWeight: 600, py: 0.5 }}
                >
                  <strong>Only {product.stock} items left</strong> — order soon before it sells out!
                </Alert>
              ) : (
                <Chip
                  icon={<CheckCircle />}
                  label={`In Stock (${product.stock} available)`}
                  sx={{ bgcolor: '#DCFCE7', color: '#16A34A', fontWeight: 700, fontSize: '0.85rem', px: 1, py: 2.5 }}
                />
              )}
            </Box>

            {/* Quantity selector */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Quantity</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
                  <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={product.stock === 0}><Remove /></IconButton>
                  <Typography sx={{ px: 3, fontWeight: 600 }}>{quantity}</Typography>
                  <IconButton onClick={() => setQuantity(quantity + 1)} disabled={quantity >= product.stock || product.stock === 0}><Add /></IconButton>
                </Box>
              </Box>
            </Box>

              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                sx={{ py: 2, borderRadius: '12px', fontSize: '1.1rem' }}
              >
                {product.stock === 0
                  ? 'Out of Stock'
                  : addingToCart
                  ? 'Adding...'
                  : `Add to Cart — ₹${(product.price * quantity).toFixed(2)}`}
              </Button>

            {/* Features */}
            <Grid container spacing={2} sx={{ mt: 'auto' }}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'primary.50', color: 'primary.main', display: 'flex' }}>
                    <LocalShipping fontSize="small" />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Free Shipping</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'primary.50', color: 'primary.main', display: 'flex' }}>
                    <Security fontSize="small" />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>2 Year Warranty</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Reviews Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Customer Reviews</Typography>
        <Grid container spacing={6}>
          <Grid item xs={12} md={7}>
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, idx) => (
                <Box key={idx} sx={{ mb: 4, pb: 4, borderBottom: '1px solid #E2E8F0' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {review.name || review.user?.name || 'Anonymous User'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Rating value={review.rating} readOnly size="small" sx={{ mb: 2 }} />
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {review.comment}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">No reviews yet. Be the first to review this product!</Typography>
            )}
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ p: 4, bgcolor: '#f8f9fa', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Write a Review</Typography>
              {user ? (
                <form onSubmit={handleReviewSubmit}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Rating</Typography>
                    <Rating 
                      value={rating} 
                      onChange={(e, newValue) => setRating(newValue)} 
                      size="large" 
                    />
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Comment</Typography>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      rows="4"
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        borderRadius: '8px', 
                        border: '1px solid #ccc',
                        fontFamily: 'inherit',
                        fontSize: '1rem'
                      }}
                      placeholder="Share your thoughts about this product..."
                    />
                  </Box>
                  {reviewMessage && (
                    <Typography sx={{ mb: 2, fontWeight: 600, color: reviewMessage.includes('success') ? 'success.main' : 'error.main' }}>
                      {reviewMessage}
                    </Typography>
                  )}
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    disabled={reviewLoading}
                    sx={{ borderRadius: '8px', px: 4, py: 1 }}
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              ) : (
                <Typography>
                  Please <Button color="primary" onClick={() => navigate('/login')} sx={{ fontWeight: 800 }}>sign in</Button> to write a review.
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetails;

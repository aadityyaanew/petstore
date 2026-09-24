import { Box, Container, Typography, Grid, Button, CircularProgress, IconButton } from '@mui/material';
import { useState, useEffect } from 'react';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api, { BASE_URL } from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, bannerRes] = await Promise.allSettled([
          api.getProducts(),
          api.getBanners()
        ]);
        
        if (prodRes.status === 'fulfilled') {
          setProducts(prodRes.value.data.products || []);
        }
        if (bannerRes.status === 'fulfilled' && bannerRes.value.data.success) {
          setBanners(bannerRes.value.data.banners || []);
        }
      } catch (error) {
        console.error('Failed to fetch home data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-play banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const activeBanner = banners.length > 0 ? banners[currentSlide] : null;

  return (
    <Box>
      {/* Hero Section */}
      {loading && banners.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
           <CircularProgress />
        </Box>
      ) : activeBanner ? (
        <Box sx={{ 
          background: activeBanner.image 
            ? `linear-gradient(rgba(15,23,42,0.6), rgba(15,23,42,0.8)), url(${activeBanner.image.startsWith('http') ? activeBanner.image : `${BASE_URL}${activeBanner.image}`}) center/cover` 
            : activeBanner.gradient,
          color: 'white', 
          py: { xs: 8, md: 12 }, 
          mb: 8,
          borderRadius: { xs: 0, md: '24px' },
          mx: { xs: 0, md: 3 },
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 0.5s ease-in-out'
        }}>
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, mb: 2, fontWeight: 800 }}>
                  {activeBanner.title}
                </Typography>
                {activeBanner.subtitle && (
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, fontWeight: 400, maxWidth: 600 }}>
                    {activeBanner.subtitle}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="large" 
                    onClick={() => navigate(activeBanner.buttonLink || '/products')}
                    sx={{ px: 4, py: 1.5, borderRadius: '12px', fontSize: '1.1rem' }}
                  >
                    {activeBanner.buttonText || 'Shop Now'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Container>

          {/* Carousel Controls */}
          {banners.length > 1 && (
            <>
              <IconButton 
                onClick={handlePrevSlide}
                sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
              >
                <KeyboardArrowLeft fontSize="large" />
              </IconButton>
              <IconButton 
                onClick={handleNextSlide}
                sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
              >
                <KeyboardArrowRight fontSize="large" />
              </IconButton>
              
              {/* Dots */}
              <Box sx={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 1 }}>
                {banners.map((_, idx) => (
                  <Box 
                    key={idx} 
                    onClick={() => setCurrentSlide(idx)}
                    sx={{ 
                      width: 10, height: 10, borderRadius: '50%', 
                      bgcolor: idx === currentSlide ? 'white' : 'rgba(255,255,255,0.3)',
                      cursor: 'pointer', transition: 'all 0.3s ease'
                    }} 
                  />
                ))}
              </Box>
            </>
          )}
        </Box>
      ) : (
        /* Fallback Static Hero when no dynamic banners */
        <Box sx={{ 
          bgcolor: '#0F172A', 
          color: 'white', 
          py: { xs: 8, md: 12 }, 
          mb: 8,
          borderRadius: { xs: 0, md: '24px' },
          mx: { xs: 0, md: 3 },
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(15,23,42,0) 70%)' }} />
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, mb: 2 }}>
                  Elevate Your Everyday.
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, fontWeight: 400, maxWidth: 480 }}>
                  Discover our curated collection of premium products designed to enhance your lifestyle and spark joy.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button onClick={() => navigate('/products')} variant="contained" color="secondary" size="large" sx={{ px: 4, py: 1.5, borderRadius: '12px', fontSize: '1.1rem' }}>
                    Shop Collection
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}

      {/* Featured Products Section */}
      <Container maxWidth="xl" sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
          <Box>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, mb: 1 }}>
              Featured Products
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Handpicked selections just for you
            </Typography>
          </Box>
          <Button color="primary" sx={{ display: { xs: 'none', sm: 'flex' }, fontWeight: 700 }} onClick={() => navigate('/products')}>
            View All →
          </Button>
        </Box>
        
        <Grid container spacing={4}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : products.length === 0 ? (
            <Box sx={{ width: '100%', py: 8, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">No products found.</Typography>
            </Box>
          ) : (
            products.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={3}>
                <ProductCard product={{
                  id: product._id,
                  title: product.name,
                  price: product.price,
                  category: product.category,
                  image: product.images?.[0] || '',
                  isNew: false,
                }} />
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;

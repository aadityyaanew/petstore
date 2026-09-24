import { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Card, CardMedia, CardContent, Divider, Checkbox, FormControlLabel, FormGroup, Slider, Button, Pagination, Drawer, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { FilterList, Close } from '@mui/icons-material';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const categoriesList = ['Electronics', 'Clothing', 'Footwear', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys'];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [search, selectedCategory, priceRange, page]);

  useEffect(() => {
    if (initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory);
    }
    // eslint-disable-next-line
  }, [initialCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.getProducts({
        search,
        category: selectedCategory,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        page,
        limit: 12
      });
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
    if (cat !== 'All') {
      setSearchParams({ ...Object.fromEntries([...searchParams]), category: cat });
    } else {
      const params = Object.fromEntries([...searchParams]);
      delete params.category;
      setSearchParams(params);
    }
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setPage(1);
  };

  const FilterContent = (
    <Box sx={{ p: isMobile ? 3 : 0, width: isMobile ? 280 : 'auto' }}>
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Filters</Typography>
          <IconButton onClick={() => setMobileFiltersOpen(false)}><Close /></IconButton>
        </Box>
      )}
      {!isMobile && <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Filters</Typography>}
      <Divider sx={{ mb: 3 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Categories</Typography>
      <FormGroup sx={{ mb: 4 }}>
        <FormControlLabel 
          control={<Checkbox checked={selectedCategory === 'All'} onChange={() => handleCategoryChange('All')} />} 
          label="All Categories" 
        />
        {categoriesList.map(cat => (
          <FormControlLabel
            key={cat}
            control={<Checkbox checked={selectedCategory === cat} onChange={() => handleCategoryChange(cat)} />}
            label={cat}
          />
        ))}
      </FormGroup>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Price Range (₹)</Typography>
      <Slider
        value={priceRange}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={0}
        max={5000}
        sx={{ color: 'primary.main', mb: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">₹{priceRange[0]}</Typography>
        <Typography variant="body2" color="text.secondary">₹{priceRange[1]}</Typography>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
      {search && (
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>
          Search results for: "{search}"
        </Typography>
      )}

      {isMobile && (
        <Box sx={{ mb: 3, display: 'flex' }}>
          <Button 
            variant="outlined" 
            startIcon={<FilterList />} 
            onClick={() => setMobileFiltersOpen(true)}
            sx={{ borderRadius: '20px', fontWeight: 600 }}
          >
            Filters
          </Button>
        </Box>
      )}

      <Drawer
        anchor="left"
        open={isMobile && mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        ModalProps={{ keepMounted: true }}
      >
        {FilterContent}
      </Drawer>

      <Grid container spacing={4}>
        {/* Sidebar Filters */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              {FilterContent}
            </Box>
          </Grid>
        )}

        {/* Product Grid */}
        <Grid item xs={12} md={9}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : products.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary">No products found matching your criteria.</Typography>
              <Button onClick={() => { setSelectedCategory('All'); setPriceRange([0, 5000]); setSearchParams({}); }} variant="outlined" sx={{ mt: 3 }}>
                Clear Filters
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={4}>
                {products.map((product) => (
                  <Grid item key={product._id} xs={12} sm={6} md={4}>
                    <Card
                      component={Link}
                      to={`/product/${product._id}`}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        textDecoration: 'none',
                        borderRadius: '16px',
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(0,0,0,0.05)',
                        boxShadow: 'none',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="240"
                        image={product.images?.[0] || 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=400&h=400&fit=crop'}
                        alt={product.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                          {product.category}
                        </Typography>
                        <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 1, color: 'text.primary' }}>
                          {product.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
                            ₹{product.price.toFixed(2)}
                          </Typography>
                          {product.originalPrice > product.price && (
                            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                              ₹{product.originalPrice.toFixed(2)}
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={(e, val) => setPage(val)} 
                    color="primary" 
                    size="large" 
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Products;

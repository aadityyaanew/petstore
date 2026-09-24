import { Box, Container, Typography, Grid, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#0F172A', color: 'white', pt: 8, pb: 4, mt: 'auto' }}>
      <Container maxWidth="xl">
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
              LUXE
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 300 }}>
              Premium e-commerce destination for curated lifestyle products. Experience the difference in quality and design.
            </Typography>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Shop</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} to="/products?sort=newest" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>New Arrivals</MuiLink>
              <MuiLink component={Link} to="/products?sort=bestselling" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>Best Sellers</MuiLink>
              <MuiLink component={Link} to="/products?sale=true" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>On Sale</MuiLink>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Support</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} to="/faq" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>FAQ</MuiLink>
              <MuiLink component={Link} to="/shipping" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>Shipping</MuiLink>
              <MuiLink component={Link} to="/returns" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>Returns</MuiLink>
              <MuiLink component={Link} to="/contact" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>Contact Us</MuiLink>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Company & Legal</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} to="/about" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>About Us</MuiLink>
              <MuiLink component={Link} to="/privacy" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>Privacy Policy</MuiLink>
              <MuiLink component={Link} to="/terms" color="inherit" underline="hover" sx={{ opacity: 0.7 }}>Terms & Conditions</MuiLink>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ opacity: 0.5 }}>
            © {new Date().getFullYear()} Luxe E-Commerce. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

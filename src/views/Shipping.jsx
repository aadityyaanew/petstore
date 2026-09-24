import { Box, Container, Typography, Grid, Card, CardContent, Divider } from '@mui/material';

const Shipping = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8, minHeight: '60vh' }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2, textAlign: 'center' }}>
        Shipping Information
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 6, textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
        Everything you need to know about our shipping policies, delivery times, and costs.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: 4 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Standard Shipping</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2, minHeight: 80 }}>
                Delivery in 3-5 business days. Available for all addresses within the contiguous United States.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 800 }}>₹79.00</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Free on orders over ₹1000</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, bgcolor: 'primary.main' }} />
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Express Shipping</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2, minHeight: 80 }}>
                Fast delivery within 1-2 business days. Order by 2 PM EST for same-day processing.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 800 }}>₹299.00</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Flat rate nationwide</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: 4 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>International</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2, minHeight: 80 }}>
                Delivery times vary by destination (typically 7-14 business days). Customs fees may apply.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 800 }}>Calculated</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Based on destination</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 8, p: 4, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Order Tracking</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          Once your order has been dispatched, you will receive an email containing a tracking number. 
          You can use this number to track your package on our carrier's website. Please allow 24 hours 
          for the tracking information to update after receiving your dispatch email.
        </Typography>
      </Box>
    </Container>
  );
};

export default Shipping;

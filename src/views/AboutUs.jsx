import { Box, Container, Typography, Grid, Paper } from '@mui/material';

const AboutUs = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8, minHeight: '60vh' }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 4, textAlign: 'center' }}>
        About LUXE
      </Typography>
      
      <Grid container spacing={6} alignItems="center" sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Box 
            component="img" 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" 
            alt="About Us"
            sx={{ width: '100%', borderRadius: 4, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Our Story
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
            Founded with a passion for premium lifestyle products, LUXE has grown into a premier destination for curated, high-quality merchandise. We believe that shopping should be more than just a transaction; it should be an experience of discovering products that elevate your everyday life.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            Our team scours the globe to bring you an exclusive selection of products that meet our rigorous standards for design, durability, and aesthetics. From the moment you browse our store to the unboxing experience at home, we are dedicated to providing excellence.
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, height: '100%', borderRadius: 4, textAlign: 'center', boxShadow: 'none', border: '1px solid rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Quality First</Typography>
            <Typography color="text.secondary">Every product in our catalog undergoes rigorous quality checks to ensure it meets our premium standards.</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, height: '100%', borderRadius: 4, textAlign: 'center', boxShadow: 'none', border: '1px solid rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Customer Centric</Typography>
            <Typography color="text.secondary">Your satisfaction is our priority. Our dedicated support team is always here to help you with any inquiries.</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, height: '100%', borderRadius: 4, textAlign: 'center', boxShadow: 'none', border: '1px solid rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Secure Shopping</Typography>
            <Typography color="text.secondary">We utilize industry-leading encryption and verified payment gateways (like Razorpay) to ensure your data is always safe.</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AboutUs;

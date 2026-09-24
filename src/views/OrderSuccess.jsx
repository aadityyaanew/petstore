import { Box, Typography, Button, Container } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <CheckCircleOutline sx={{ fontSize: 100, color: '#4caf50', mb: 3 }} />
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#1a1a1a' }}>
          Payment Successful!
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4, fontWeight: 400 }}>
          Thank you for your purchase. Your order has been placed successfully and is being processed.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" size="large" onClick={() => navigate('/orders')} sx={{ borderRadius: '8px', px: 4 }}>
            View Orders
          </Button>
          <Button variant="contained" color="primary" size="large" onClick={() => navigate('/')} sx={{ borderRadius: '8px', px: 4 }}>
            Continue Shopping
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default OrderSuccess;

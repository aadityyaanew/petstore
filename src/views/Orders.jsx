import { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, CircularProgress, Chip, Grid } from '@mui/material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const res = await api.getMyOrders();
        setOrders(res.data || []);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 4 }}>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography variant="h6" color="text.secondary">You have not placed any orders yet.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {orders.map((order) => (
            <Card key={order._id} sx={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Order #{order._id}</Typography>
                    <Typography variant="body2">Placed on: {new Date(order.createdAt).toLocaleDateString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={order.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment'} 
                      color={order.paymentStatus === 'paid' ? 'success' : 'warning'} 
                      size="small" 
                    />
                    <Chip 
                      label={order.status} 
                      color={order.status === 'delivered' ? 'primary' : 'default'} 
                      size="small" 
                    />
                  </Box>
                </Box>
                
                <Grid container spacing={2}>
                  {order.items.map((item, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, border: '1px solid #F1F5F9', borderRadius: '8px' }}>
                        <Box component="img" src={item.image} sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '6px' }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{item.quantity} x ₹{item.price.toFixed(2)}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Total: <Box component="span" sx={{ color: 'primary.main' }}>₹{order.totalPrice.toFixed(2)}</Box>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Orders;

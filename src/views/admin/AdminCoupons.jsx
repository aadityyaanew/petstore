import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, TextField, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress } from '@mui/material';
import { Delete, LocalOffer } from '@mui/icons-material';
import api from '../../services/api';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    expiryDate: ''
  });

  const fetchCoupons = async () => {
    try {
      const { data } = await api.getCoupons();
      setCoupons(data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createCoupon({
        ...formData,
        discountValue: Number(formData.discountValue),
      });
      setFormData({ code: '', discountType: 'percentage', discountValue: '', expiryDate: '' });
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating coupon');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await api.deleteCoupon(id);
        fetchCoupons();
      } catch (error) {
        console.error('Error deleting coupon:', error);
      }
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <LocalOffer color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Manage Coupons</Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Create New Coupon</Typography>
              <form onSubmit={handleCreateCoupon}>
                <TextField 
                  label="Coupon Code (e.g. SAVE20)" 
                  name="code" 
                  value={formData.code} 
                  onChange={handleChange} 
                  fullWidth 
                  required 
                  sx={{ mb: 3 }}
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Discount Type</InputLabel>
                  <Select
                    name="discountType"
                    value={formData.discountType}
                    label="Discount Type"
                    onChange={handleChange}
                  >
                    <MenuItem value="percentage">Percentage (%)</MenuItem>
                    <MenuItem value="fixed">Fixed Amount (₹)</MenuItem>
                  </Select>
                </FormControl>

                <TextField 
                  label={`Discount Value ${formData.discountType === 'percentage' ? '(1-100)' : '(₹)'}`}
                  name="discountValue" 
                  type="number"
                  value={formData.discountValue} 
                  onChange={handleChange} 
                  fullWidth 
                  required 
                  sx={{ mb: 3 }}
                />

                <TextField 
                  label="Expiry Date" 
                  name="expiryDate" 
                  type="date"
                  value={formData.expiryDate} 
                  onChange={handleChange} 
                  fullWidth 
                  required 
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 4 }}
                />

                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  size="large"
                  disabled={creating}
                  sx={{ py: 1.5, borderRadius: '8px', fontWeight: 700 }}
                >
                  {creating ? 'Creating...' : 'Create Coupon'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Discount</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Valid Until</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {coupons.map((coupon) => {
                    const isExpired = new Date(coupon.expiryDate) < new Date();
                    return (
                      <TableRow key={coupon._id} hover>
                        <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>{coupon.code}</TableCell>
                        <TableCell>
                          {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                        </TableCell>
                        <TableCell>{new Date(coupon.expiryDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            color: isExpired ? 'error.main' : 'success.main',
                            fontWeight: 600,
                            bgcolor: isExpired ? 'error.50' : 'success.50',
                            display: 'inline-block',
                            px: 1, py: 0.5, borderRadius: '4px'
                          }}>
                            {isExpired ? 'Expired' : 'Active'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleDelete(coupon._id)} color="error">
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {coupons.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No coupons created yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminCoupons;

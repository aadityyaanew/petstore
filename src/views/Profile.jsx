import { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Grid, Avatar } from '@mui/material';
import { Person } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth(); // Assuming login context updates user state if we call it with new user data?  We'll see.
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // In a real app we'd define api.updateProfile. For now we can use raw fetch wrapper or add it to api.js.
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setMessage('Profile updated successfully!');
      // Update Auth context (simplistic way)
      localStorage.setItem('user', JSON.stringify(data.user));
      // Reset passwords
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, textAlign: 'center' }}>My Profile</Typography>

      <Card sx={{ borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
              <Person sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
            </Box>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Personal Info</Typography>
                <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                <TextField label="Email" name="email" value={formData.email} onChange={handleChange} InputProps={{ readOnly: true }} fullWidth disabled />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Change Password</Typography>
                <TextField label="Current Password" name="currentPassword" type="password" value={formData.currentPassword} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                <TextField label="New Password" name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} fullWidth />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, mt: 2 }}>Address Details</Typography>
              </Grid>
              <Grid item xs={12}><TextField label="Street Address" name="street" value={formData.street} onChange={handleChange} fullWidth /></Grid>
              <Grid item xs={6} md={4}><TextField label="City" name="city" value={formData.city} onChange={handleChange} fullWidth /></Grid>
              <Grid item xs={6} md={4}><TextField label="State" name="state" value={formData.state} onChange={handleChange} fullWidth /></Grid>
              <Grid item xs={12} md={4}><TextField label="ZIP Code" name="zipCode" value={formData.zipCode} onChange={handleChange} fullWidth /></Grid>
            </Grid>

            {message && (
              <Typography color={message.includes('success') ? 'success.main' : 'error.main'} sx={{ mt: 3, fontWeight: 600, textAlign: 'center' }}>
                {message}
              </Typography>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ px: 6, py: 1.5, borderRadius: '8px', fontSize: '1rem' }}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;

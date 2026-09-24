import { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: 5, borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 24px rgba(0,0,0,0.02)' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
          Create an Account
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
          Join Luxe to checkout securely and track your orders.
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 3, textAlign: 'center', bgcolor: '#FEF2F2', p: 2, borderRadius: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large" 
            fullWidth 
            sx={{ mt: 4, mb: 3, py: 1.5, borderRadius: '12px', fontSize: '1.1rem' }}
          >
            Create Account
          </Button>
          
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <MuiLink component={Link} to="/login" color="primary" sx={{ fontWeight: 600 }}>
              Sign In
            </MuiLink>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;

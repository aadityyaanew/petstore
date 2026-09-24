import { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: 5, borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 24px rgba(0,0,0,0.02)' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
          Welcome back
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
          Enter your details to access your account.
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 3, textAlign: 'center', bgcolor: '#FEF2F2', p: 2, borderRadius: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            required
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

          <Box sx={{ textAlign: 'right', mt: 0.5, mb: 1 }}>
            <MuiLink component={Link} to="/forgot-password" color="primary" variant="body2" sx={{ fontWeight: 500 }}>
              Forgot Password?
            </MuiLink>
          </Box>
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large" 
            fullWidth 
            sx={{ mt: 4, mb: 3, py: 1.5, borderRadius: '12px', fontSize: '1.1rem' }}
          >
            Sign In
          </Button>
          
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Don't have an account?{' '}
            <MuiLink component={Link} to="/register" color="primary" sx={{ fontWeight: 600 }}>
              Create an account
            </MuiLink>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;

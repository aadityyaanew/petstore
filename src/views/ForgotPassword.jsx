import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Link as MuiLink,
  Alert,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await api.forgotPassword(email);
      setSuccess(res.data.message || 'Check your inbox for the reset link!');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '20px',
            bgcolor: 'rgba(15, 23, 42, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <EmailOutlinedIcon sx={{ fontSize: 36, color: 'primary.main' }} />
        </Box>

        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 800, mb: 1, textAlign: 'center', color: '#1E293B' }}
        >
          Forgot Password?
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, textAlign: 'center', lineHeight: 1.7 }}
        >
          No worries! Enter your registered email and we'll send you a secure link to reset your password.
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="you@example.com"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading}
              sx={{
                mt: 4,
                mb: 3,
                py: 1.5,
                borderRadius: '12px',
                fontSize: '1.1rem',
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        )}

        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Remember your password?{' '}
          <MuiLink component={Link} to="/login" color="primary" sx={{ fontWeight: 600 }}>
            Back to Sign In
          </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Mail } from 'lucide-react';

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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-border p-8 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-pink/10 flex items-center justify-center mx-auto mb-6">
            <Mail size={32} className="text-brand-pink" />
          </div>

          <h1 className="text-2xl font-extrabold text-foreground mb-2">Forgot Password?</h1>
          <p className="text-muted-foreground mb-6 text-sm">
            No worries! Enter your registered email and we'll send you a secure link to reset your password.
          </p>

          {success && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Email Address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-brand-pink font-semibold hover:underline">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { GoogleLogin } from '@react-oauth/google';
import { ShieldCheck } from 'lucide-react';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { googleLogin, completeGoogleSignup } = useAuth();
  const navigate = useNavigate();

  // State for the phone number requirement step
  const [requiresPhone, setRequiresPhone] = useState(false);
  const [signupData, setSignupData] = useState(null);
  const [phone, setPhone] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      const res = await googleLogin(credentialResponse.credential);

      if (res.requiresPhone) {
        setRequiresPhone(true);
        setSignupData({ signupToken: res.signupToken });
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await completeGoogleSignup({
        ...signupData,
        phone,
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete signup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-[400px]">
        {/* Card */}
        <div className="bg-card rounded-2xl p-8 sm:p-10 shadow-lg border border-border flex flex-col items-center text-center relative">

          {/* Logo */}
          <div className="absolute -top-12">
            <Link to="/" className="inline-flex items-center justify-center bg-background p-1.5 rounded-full shadow-md border border-border">
              <img
                src="/logo.jpeg"
                alt="Poonch Pet Store"
                className="w-20 h-20 rounded-full object-cover"
              />
            </Link>
          </div>

          <div className="mt-12 w-full">
            {/* Header Text */}
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-3 tracking-tight">
              {requiresPhone ? 'Complete Signup' : (
                <>Welcome to <span className="text-primary font-[family-name:var(--font-lora)]">Poonch Pet Store</span></>
              )}
            </h1>

            <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-[340px] mx-auto font-medium">
              {requiresPhone
                ? 'Please provide your phone number to complete the signup process.'
                : 'Sign in to continue your pet shopping journey and manage your orders seamlessly.'}
            </p>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-semibold">
                {error}
              </div>
            )}

            {!requiresPhone ? (
              <div className="flex flex-col items-center w-full">
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      setError('Google Login Failed');
                    }}
                    shape="pill"
                    theme="outline"
                    text="continue_with"
                    size="large"
                    width="340"
                    logo_alignment="center"
                  />
                </div>

                {loading && <p className="text-sm text-muted-foreground mt-4 font-medium animate-pulse">Authenticating...</p>}
              </div>
            ) : (
              <form onSubmit={handlePhoneSubmit} className="space-y-5 text-left w-full">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground ml-1" htmlFor="phone">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="h-12 rounded-xl bg-background"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl font-bold text-sm transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Completing…
                    </span>
                  ) : 'Complete Signup'}
                </Button>
              </form>
            )}

            {/* Footer Section */}
            <div className="mt-10 w-full">
              <hr className="border-border mb-6" />

              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-semibold">Secure and encrypted</span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed font-medium max-w-[250px] mx-auto">
                By continuing, you agree to our{' '}
                <Link to="/terms" className="text-foreground hover:text-primary transition-colors underline underline-offset-2">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-foreground hover:text-primary transition-colors underline underline-offset-2">Privacy Policy</Link>.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

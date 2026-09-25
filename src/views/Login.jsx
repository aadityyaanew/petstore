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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#F9FAFB]">
      <div className="w-full max-w-[440px]">
        {/* Card */}
        <div className="bg-white rounded-[24px] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center text-center relative">
          
          {/* Logo */}
          <div className="absolute -top-14 sm:-top-16">
            <Link to="/" className="inline-flex items-center justify-center bg-white p-1.5 sm:p-2 rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.08)]">
              <img 
                src="/logo.jpeg" 
                alt="Poonch Pet Store" 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover" 
              />
            </Link>
          </div>

          <div className="mt-12 sm:mt-16 w-full">
            {/* Header Text */}
            <h1 className="text-[28px] sm:text-[32px] font-extrabold text-gray-900 leading-tight mb-3 tracking-tight">
              {requiresPhone ? 'Complete Signup' : (
                <>Welcome to <span className="text-brand-pink">Poonch Pet Store</span></>
              )}
            </h1>
            
            <p className="text-[15px] text-gray-500 mb-8 leading-relaxed max-w-[340px] mx-auto font-medium">
              {requiresPhone 
                ? 'Please provide your phone number to complete the signup process.' 
                : 'Sign in to continue your pet shopping journey and manage your orders seamlessly.'}
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-semibold">
                {error}
              </div>
            )}

            {!requiresPhone ? (
              <div className="flex flex-col items-center w-full">
                {/* We use width="100%" equivalent, but GoogleLogin takes specific widths or fits container.
                    Using shape="pill", theme="outline", text="continue_with" matches the screenshot perfectly */}
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
                
                {loading && <p className="text-sm text-gray-400 mt-4 font-medium animate-pulse">Authenticating...</p>}
              </div>
            ) : (
              <form onSubmit={handlePhoneSubmit} className="space-y-5 text-left w-full">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1" htmlFor="phone">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="h-12 rounded-xl border-gray-200 focus:border-brand-pink focus:ring-brand-pink/20 bg-gray-50"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-brand-pink hover:bg-brand-pink/90 text-white font-bold text-[15px] transition-all shadow-md shadow-brand-pink/20"
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
              <hr className="border-gray-100 mb-6" />
              
              <div className="flex items-center justify-center gap-2 text-[#C69255] mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[13px] font-bold">Secure and encrypted</span>
              </div>
              
              <p className="text-[12px] text-gray-400 leading-relaxed font-medium max-w-[250px] mx-auto">
                By continuing, you agree to our{' '}
                <Link to="/terms" className="text-gray-500 hover:text-brand-pink transition-colors underline decoration-gray-300 underline-offset-2">Terms of Service</Link> 
                {' '}and{' '}
                <Link to="/privacy" className="text-gray-500 hover:text-brand-pink transition-colors underline decoration-gray-300 underline-offset-2">Privacy Policy</Link>.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

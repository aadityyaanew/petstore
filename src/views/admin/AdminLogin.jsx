import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ShieldCheck, Lock, Mail, AlertCircle, LogOut, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  if (user && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser && loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        logout();
        setError('Access denied. This account does not have administrator privileges.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Invalid admin credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-3.5 sm:px-4 py-8 sm:py-12 bg-background">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center mb-4 sm:mb-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-pink/10 border-2 border-brand-pink/30 shadow-md">
            <ShieldCheck className="w-8 h-8 text-brand-pink" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1.5 sm:mb-2">Admin Portal</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Sign in with administrative privileges</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-border p-5 xs:p-6 sm:p-8 shadow-sm">
          {user && user.role !== 'admin' && (
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 font-semibold text-amber-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Signed in as standard user
              </div>
              <p className="text-muted-foreground text-xs">
                You are logged in as <span className="font-semibold text-foreground">{user.email}</span>. Administrator access requires admin credentials.
              </p>
              <button
                type="button"
                onClick={logout}
                className="mt-1 self-start inline-flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-800 font-medium underline"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out current user
              </button>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5" htmlFor="admin-email">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Admin Email
              </label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@poonch.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5" htmlFor="admin-password">
                <Lock className="w-4 h-4 text-muted-foreground" />
                Password
              </label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating…
                </span>
              ) : (
                'Sign In to Admin Portal'
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <Link
              to="/"
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Return to public store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

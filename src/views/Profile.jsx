import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { User } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/profile', {
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
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Error updating profile');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 sm:mb-8">My Profile</h1>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 xs:p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 sm:gap-4 mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-pink text-white flex items-center justify-center shrink-0 shadow-md">
              <User size={28} className="sm:w-8 sm:h-8" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">{user?.name}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground break-all">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-base sm:text-lg border-b border-border pb-2">Personal Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold">Full Name</label>
                    <Input name="name" value={formData.name} onChange={handleChange} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold">Email</label>
                    <Input name="email" value={formData.email} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs sm:text-sm font-semibold">Phone Number</label>
                    <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="e.g. +91 9876543210" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-base sm:text-lg border-b border-border pb-2 mt-2">Address Details</h3>
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold">Street Address</label>
                <Input name="street" value={formData.street} onChange={handleChange} placeholder="123 Main Street" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold">City</label>
                  <Input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold">State</label>
                  <Input name="state" value={formData.state} onChange={handleChange} placeholder="State" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold">ZIP Code</label>
                  <Input name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="ZIP code" />
                </div>
              </div>
            </div>

            {message && (
              <div className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm font-medium ${isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                {message}
              </div>
            )}

            <div className="flex justify-center pt-2 sm:pt-4">
              <Button type="submit" variant="secondary" size="lg" disabled={loading} className="w-full sm:w-auto min-w-[200px] h-12 text-sm sm:text-base font-bold">
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { User, MapPin, Plus, Trash2, Edit2, X } from 'lucide-react';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const Profile = () => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', phone: user.phone || '' });
      setAddresses(user.addresses || []);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const saveProfileData = async (updatedData) => {
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
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage('Profile updated successfully!');
      localStorage.setItem('user', JSON.stringify(data.user));
      if (setUser) setUser(data.user);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Error updating profile');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProfileData({ ...formData, addresses });
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    let newAddresses = [...addresses];

    // If setting as default, remove default from others
    if (addressForm.isDefault) {
      newAddresses = newAddresses.map(a => ({ ...a, isDefault: false }));
    }

    if (editingIndex !== null) {
      newAddresses[editingIndex] = addressForm;
    } else {
      if (newAddresses.length === 0) addressForm.isDefault = true;
      newAddresses.push(addressForm);
    }

    setAddresses(newAddresses);
    setShowAddressForm(false);
    saveProfileData({ ...formData, addresses: newAddresses });
  };

  const deleteAddress = (index) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    const newAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(newAddresses);
    saveProfileData({ ...formData, addresses: newAddresses });
  };

  const openAddressForm = (index = null) => {
    if (index !== null) {
      setEditingIndex(index);
      setAddressForm(addresses[index]);
    } else {
      setEditingIndex(null);
      setAddressForm({
        fullName: formData.name || '',
        phone: formData.phone || '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
    }
    setShowAddressForm(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-6 sm:py-10">
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
              <h3 className="font-semibold text-base sm:text-lg border-b border-border pb-2 mt-6">Saved Addresses</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr, idx) => (
                  <div key={idx} className="border border-border rounded-xl p-4 sm:p-5 relative bg-gray-50/50 hover:border-brand-pink/50 transition-colors">
                    {addr.isDefault && (
                      <Badge className="absolute top-4 right-4 bg-gray-900">Default</Badge>
                    )}
                    <h4 className="font-bold text-gray-900">{addr.fullName}</h4>
                    <p className="text-sm text-gray-600 mt-1">{addr.street}</p>
                    <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.pincode}</p>
                    <p className="text-sm font-semibold text-gray-700 mt-2">Phone: {addr.phone}</p>

                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                      <button type="button" onClick={() => openAddressForm(idx)} className="text-sm font-semibold text-brand-pink flex items-center gap-1 hover:underline">
                        <Edit2 size={14} /> Edit
                      </button>
                      <button type="button" onClick={() => deleteAddress(idx)} className="text-sm font-semibold text-red-500 flex items-center gap-1 hover:underline">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => openAddressForm()}
                  className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:text-brand-pink hover:border-brand-pink hover:bg-brand-pink/5 transition-all h-full min-h-[160px]"
                >
                  <Plus size={24} className="mb-2" />
                  <span className="font-semibold">Add New Address</span>
                </button>
              </div>
            </div>

            {message && (
              <div className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm font-medium ${isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                {message}
              </div>
            )}

            <div className="flex justify-start pt-2 sm:pt-4">
              <Button type="submit" variant="secondary" size="lg" disabled={loading} className="w-full sm:w-auto min-w-[200px] h-12 text-sm sm:text-base font-bold bg-gray-900 text-white hover:bg-gray-800">
                {loading ? 'Saving...' : 'Save Personal Info'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-6 border-b border-border flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2"><MapPin size={20} className="text-brand-pink" /> {editingIndex !== null ? 'Edit Address' : 'Add New Address'}</h3>
              <button onClick={() => setShowAddressForm(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto">
              <form id="address-form" onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold">Full Name</label>
                    <Input name="fullName" value={addressForm.fullName} onChange={handleAddressChange} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold">Phone Number</label>
                    <Input name="phone" type="tel" value={addressForm.phone} onChange={handleAddressChange} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold">Street Address / Locality</label>
                  <Input name="street" value={addressForm.street} onChange={handleAddressChange} required placeholder="House No, Building, Street" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold">Pincode</label>
                    <Input name="pincode" value={addressForm.pincode} onChange={handleAddressChange} required placeholder="6 digits" pattern="[0-9]{6}" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-semibold">City / District</label>
                    <Input name="city" value={addressForm.city} onChange={handleAddressChange} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold">State</label>
                  <select
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressChange}
                    required
                    className="w-full h-10 px-3 py-2 rounded-md border border-input bg-transparent text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="" disabled>Select State</option>
                    {INDIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="w-4 h-4 text-brand-pink rounded border-gray-300 focus:ring-brand-pink"
                  />
                  <label htmlFor="isDefault" className="text-sm font-medium cursor-pointer">Make this my default address</label>
                </div>
              </form>
            </div>

            <div className="p-4 sm:p-6 border-t border-border bg-gray-50 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)}>Cancel</Button>
              <Button type="submit" form="address-form" className="bg-brand-pink text-white hover:bg-brand-pink/90">Save Address</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

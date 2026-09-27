import { useState, useEffect } from 'react';
import { Tag, Trash2, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import api from '../../services/api';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    expiryDate: ''
  });

  const fetchCoupons = async () => {
    try {
      const { data } = await api.getCoupons();
      setCoupons(data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createCoupon({
        ...formData,
        discountValue: Number(formData.discountValue),
      });
      setFormData({ code: '', discountType: 'percentage', discountValue: '', expiryDate: '' });
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating coupon');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await api.deleteCoupon(id);
        fetchCoupons();
      } catch (error) {
        console.error('Error deleting coupon:', error);
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-brand-pink/20 border-t-brand-pink rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center">
          <Tag size={24} />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">Manage Coupons</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus size={20} /> Create Coupon</h2>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Coupon Code</label>
                <Input 
                  name="code" 
                  value={formData.code} 
                  onChange={handleChange} 
                  required 
                  className="uppercase"
                  placeholder="e.g. SAVE20"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Discount Type</label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold">
                  Discount Value {formData.discountType === 'percentage' ? '(1-100)' : '(₹)'}
                </label>
                <Input 
                  name="discountValue" 
                  type="number"
                  value={formData.discountValue} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Expiry Date</label>
                <Input 
                  name="expiryDate" 
                  type="date"
                  value={formData.expiryDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <Button 
                type="submit" 
                variant="secondary" 
                className="w-full mt-2"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create Coupon'}
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-accent/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Code</th>
                    <th className="px-6 py-4 font-semibold">Discount</th>
                    <th className="px-6 py-4 font-semibold">Valid Until</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {coupons.map((coupon) => {
                    const isExpired = new Date(coupon.expiryDate) < new Date();
                    return (
                      <tr key={coupon._id} className="hover:bg-accent/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-brand-pink">{coupon.code}</td>
                        <td className="px-6 py-4 font-medium">
                          {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                        </td>
                        <td className="px-6 py-4">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <Badge variant={isExpired ? "destructive" : "success"}>
                            {isExpired ? 'Expired' : 'Active'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDelete(coupon._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {coupons.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        No coupons created yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;

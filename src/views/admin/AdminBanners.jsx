import { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Plus, Edit, Trash2, UploadCloud, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import api, { BASE_URL } from '../../services/api';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    buttonText: 'Shop Now',
    buttonLink: '/products',
    gradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    order: 0,
    isActive: true
  });

  const fetchBanners = async () => {
    try {
      const { data } = await api.getAdminBanners();
      setBanners(data.banners || []);
    } catch (error) {
      console.error('Error fetching admin banners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpen = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || '',
        image: banner.image || '',
        buttonText: banner.buttonText || '',
        buttonLink: banner.buttonLink || '',
        gradient: banner.gradient || '',
        order: banner.order || 0,
        isActive: banner.isActive
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        image: '',
        buttonText: 'Shop Now',
        buttonLink: '/products',
        gradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        order: 0,
        isActive: true
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await api.updateBanner(editingBanner._id, formData);
      } else {
        await api.createBanner(formData);
      }
      handleClose();
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Failed to save banner');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this banner permanently?')) {
      try {
        await api.deleteBanner(id);
        fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      await api.updateBanner(banner._id, { ...banner, isActive: !banner.isActive });
      fetchBanners();
    } catch (error) {
      console.error('Error updating banner status:', error);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const { data } = await api.uploadImage(formData);
      setFormData((prev) => ({ ...prev, image: data.image }));
    } catch (error) {
      console.error('File upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-brand-pink/20 border-t-brand-pink rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center">
            <ImageIcon size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">Manage Banners</h1>
        </div>
        <Button onClick={() => handleOpen()} variant="secondary" className="gap-2">
          <Plus size={18} /> Add Banner
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Preview / Title</th>
                <th className="px-6 py-4 font-semibold">Order</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {banners.map((banner) => (
                <tr key={banner._id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-20 h-12 rounded-lg bg-cover bg-center flex flex-col items-center justify-center relative overflow-hidden"
                        style={{ background: banner.image ? `url(${banner.image.startsWith('http') ? banner.image : `${BASE_URL}${banner.image}`}) center/cover` : banner.gradient }}
                      >
                        {!banner.image && <span className="text-[10px] font-bold text-white z-10 relative">CSS</span>}
                      </div>
                      <div>
                        <p className="font-bold">{banner.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{banner.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">Order: {banner.order}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={banner.isActive} onChange={() => handleToggleActive(banner)} />
                      <div className="w-11 h-6 bg-accent peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpen(banner)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(banner._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {banners.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No banners defined. Add one to show on the homepage.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
              <h2 className="text-xl font-bold">{editingBanner ? 'Edit Banner' : 'New Banner'}</h2>
              <button onClick={handleClose} className="p-2 hover:bg-accent rounded-full text-muted-foreground"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Banner Title</label>
                <Input name="title" value={formData.title} onChange={handleChange} required />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Subtitle</label>
                <Input name="subtitle" value={formData.subtitle} onChange={handleChange} />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-semibold">Background Image URL</label>
                <div className="flex gap-2">
                  <Input name="image" value={formData.image} onChange={handleChange} placeholder="https://..." className="flex-1" />
                  <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                  <Button type="button" variant="outline" onClick={handleUploadClick} disabled={uploading}>
                    {uploading ? <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /> : <UploadCloud size={18} className="mr-2" />}
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
                {formData.image && (
                  <div 
                    className="h-24 rounded-lg bg-cover bg-center border border-border" 
                    style={{ background: `url(${formData.image.startsWith('http') ? formData.image : `${BASE_URL}${formData.image}`}) center/cover` }}
                  />
                )}
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Fallback CSS Gradient</label>
                <Input name="gradient" value={formData.gradient} onChange={handleChange} placeholder="linear-gradient(...)" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Button Text</label>
                  <Input name="buttonText" value={formData.buttonText} onChange={handleChange} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Button Link</label>
                  <Input name="buttonLink" value={formData.buttonLink} onChange={handleChange} />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Sorting Order</label>
                  <Input name="order" type="number" value={formData.order} onChange={handleChange} className="w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold">Is Active</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isActive" className="sr-only peer" checked={formData.isActive} onChange={handleChange} />
                    <div className="w-11 h-6 bg-accent peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                <Button type="submit" variant="secondary">Save Banner</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;

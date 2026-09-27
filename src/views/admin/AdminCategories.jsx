import { useState, useEffect, useRef } from 'react';
import { Layers, Trash2, Plus, Edit, UploadCloud, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import api from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true,
  });

  const fetchCategories = async () => {
    try {
      const { data } = await api.getCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image || '',
      isActive: category.isActive,
    });
    setFormModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormModalOpen(false);
    setFormData({ name: '', description: '', image: '', isActive: true });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploading(true);
    try {
      const { data } = await api.uploadImage(uploadData);
      setFormData((prev) => ({
        ...prev,
        image: data.imageUrl
      }));
    } catch (error) {
      console.error('File upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.updateCategory(editingId, formData);
      } else {
        await api.createCategory(formData);
      }
      handleCancelEdit();
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.deleteCategory(id);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-brand-pink/20 border-t-brand-pink rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center">
            <Layers size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">Manage Categories</h1>
        </div>
        <Button onClick={() => setFormModalOpen(true)} className="gap-2">
          <Plus size={18} /> Add Category
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-brand-pink flex items-center gap-3">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="w-8 h-8 rounded-md object-cover border border-border shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-md bg-accent/50 flex items-center justify-center text-xs text-muted-foreground border border-border shrink-0">No Img</div>
                    )}
                    <span className="truncate">{category.name}</span>
                  </td>
                  <td className="px-6 py-4 truncate max-w-[300px]">{category.description}</td>
                  <td className="px-6 py-4">
                    <Badge variant={category.isActive ? "success" : "secondary"}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleEdit(category)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors mr-2 inline-block"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(category._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-muted-foreground">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {formModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={handleCancelEdit}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-border flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                {editingId ? <Edit size={20} className="text-brand-pink" /> : <Plus size={20} className="text-brand-pink" />} 
                {editingId ? 'Edit Category' : 'Create Category'}
              </h2>
              <button onClick={handleCancelEdit} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Category Name</label>
                  <Input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Toys"
                    className="bg-gray-50"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="flex w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px] resize-y"
                    placeholder="Category description..."
                  ></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Category Image</label>
                  <div className="flex items-center gap-4">
                    <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                    <Button type="button" variant="outline" onClick={handleUploadClick} disabled={uploading} className="gap-2 text-xs py-1 h-9 bg-gray-50 hover:bg-gray-100">
                      {uploading ? <div className="w-3 h-3 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /> : <UploadCloud size={16} />}
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                    {formData.image && (
                      <div className="w-12 h-12 rounded-lg border border-border overflow-hidden shrink-0 shadow-sm">
                        <img src={formData.image} alt="category" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      id="isActive" 
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="peer w-5 h-5 cursor-pointer appearance-none rounded border-2 border-gray-300 checked:border-brand-pink checked:bg-brand-pink transition-colors focus:ring-brand-pink"
                    />
                    <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <label htmlFor="isActive" className="text-sm font-bold text-gray-700 cursor-pointer select-none">Set as Active</label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-border/50">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancelEdit}
                    className="flex-1 font-bold bg-white"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 font-bold shadow-sm"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : (editingId ? 'Update Category' : 'Create Category')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;

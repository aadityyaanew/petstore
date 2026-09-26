import { useState, useEffect } from 'react';
import { Layers, Trash2, Plus, Edit } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import api from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
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
      isActive: category.isActive,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', isActive: true });
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
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center">
          <Layers size={24} />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">Manage Categories</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              {editingId ? <Edit size={20} /> : <Plus size={20} />} 
              {editingId ? 'Edit Category' : 'Create Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Category Name</label>
                <Input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. Toys"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px]"
                  placeholder="Category description..."
                ></textarea>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="isActive" 
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-brand-pink rounded border-gray-300 focus:ring-brand-pink"
                />
                <label htmlFor="isActive" className="text-sm font-semibold">Active Status</label>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  type="submit" 
                  variant="secondary" 
                  className="flex-1"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                </Button>
                {editingId && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
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
                      <td className="px-6 py-4 font-bold text-brand-pink">{category.name}</td>
                      <td className="px-6 py-4 truncate max-w-[200px]">{category.description}</td>
                      <td className="px-6 py-4">
                        <Badge variant={category.isActive ? "success" : "secondary"}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleEdit(category)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors mr-2"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(category._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                        No categories found.
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

export default AdminCategories;

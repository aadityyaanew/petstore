import { useState, useEffect, useRef } from 'react';
import { Package, Plus, Edit, Trash2, UploadCloud, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import api, { BASE_URL } from '../../services/api';

const categories = ['Toys', 'Furniture', 'Bowls', 'Food', 'Clothing', 'Accessories', 'Healthcare', 'Cages'];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState(0); 
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: 'Toys', stock: '', lowStockThreshold: 5, images: []
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({ limit: 100 });
      setProducts(res.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (product = null) => {
    if (product) {
      setEditingId(product._id);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold ?? 5,
        images: product.images || [],
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', price: '', category: 'Toys', stock: '', lowStockThreshold: 5, images: [] });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
      };

      if (editingId) {
        await api.updateProduct(editingId, dataToSubmit);
      } else {
        await api.createProduct(dataToSubmit);
      }
      handleClose();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
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
        images: [...prev.images, data.image]
      }));
    } catch (error) {
      console.error('File upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const filteredProducts = activeTab === 1
    ? products.filter((p) => p.stock <= (p.lowStockThreshold ?? 5))
    : products;

  const lowStockCount = products.filter((p) => p.stock <= (p.lowStockThreshold ?? 5)).length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center">
            <Package size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">Manage Products</h1>
        </div>
        <Button onClick={() => handleOpen()} variant="secondary" className="gap-2">
          <Plus size={18} /> Add Product
        </Button>
      </div>

      <div className="flex gap-4 border-b border-border mb-6">
        <button 
          onClick={() => setActiveTab(0)}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 0 ? 'border-brand-pink text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          All Products ({products.length})
        </button>
        <button 
          onClick={() => setActiveTab(1)}
          className={`pb-3 font-semibold text-sm flex items-center gap-2 transition-colors border-b-2 ${activeTab === 1 ? 'border-brand-pink text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <AlertCircle size={16} className={activeTab === 1 ? 'text-amber-500' : ''} /> 
          Low / Out of Stock
          {lowStockCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{lowStockCount}</span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand-pink/20 border-t-brand-pink rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-accent/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Stock Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      {activeTab === 1 ? (
                        <div className="flex flex-col items-center">
                          <CheckCircle2 size={48} className="text-emerald-500 mb-2 opacity-80" />
                          <h3 className="font-bold text-lg mb-1">All caught up!</h3>
                          <p className="text-muted-foreground">No low stock products. Everything is well stocked.</p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No products found.</p>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-6 py-4 font-medium max-w-[250px] truncate">{product.name}</td>
                      <td className="px-6 py-4">{product.category}</td>
                      <td className="px-6 py-4 font-bold text-brand-pink">₹{product.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        {product.stock === 0 ? (
                          <Badge variant="destructive">Out of Stock</Badge>
                        ) : product.stock <= (product.lowStockThreshold ?? 5) ? (
                          <Badge variant="warning">Low Stock ({product.stock})</Badge>
                        ) : (
                          <Badge variant="success">In Stock ({product.stock})</Badge>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Alert ≤ {product.lowStockThreshold ?? 5}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpen(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={handleClose} className="p-2 hover:bg-accent rounded-full text-muted-foreground"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Product Name</label>
                <Input name="name" value={formData.name} onChange={handleChange} required />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Description</label>
                <Textarea name="description" value={formData.description} onChange={handleChange} required rows={3} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Price (₹)</label>
                  <Input name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Stock Quantity</label>
                  <Input name="stock" type="number" min="0" value={formData.stock} onChange={handleChange} required />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Low Stock Alert At</label>
                  <Input name="lowStockThreshold" type="number" min="0" value={formData.lowStockThreshold} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold">Product Images</label>
                <div className="flex gap-4 mb-4">
                  <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                  <Button type="button" variant="outline" onClick={handleUploadClick} disabled={uploading} className="gap-2">
                    {uploading ? <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /> : <UploadCloud size={18} />}
                    {uploading ? 'Uploading...' : 'Add Image'}
                  </Button>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group rounded-xl overflow-hidden border border-border h-32">
                        <img 
                          src={img.startsWith('http') ? img : `${BASE_URL}${img}`} 
                          alt={`product-${index}`} 
                          className="w-full h-full object-cover"
                        />
                        <button 
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-border">
                <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                <Button type="submit" variant="secondary">Save Product</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

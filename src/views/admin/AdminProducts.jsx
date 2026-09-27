import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, Edit, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import api from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0); 

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
        <Link to="/admin/products/new">
          <Button variant="secondary" className="gap-2">
            <Plus size={18} /> Add Product
          </Button>
        </Link>
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
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-accent/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-semibold w-16">Image</th>
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
                    <td colSpan={6} className="px-6 py-16 text-center">
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
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 border border-border overflow-hidden shrink-0">
                          <img 
                            src={(product.images && product.images[0] && product.images[0] !== '[object Object]') ? (typeof product.images[0] === 'object' && product.images[0] !== null ? product.images[0].url : product.images[0]) : (product.image !== '[object Object]' ? product.image : null) || 'https://placehold.co/400x400/f8f9fa/a1a1aa?text=No+Image'}
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium max-w-[250px] truncate">
                        <div className="flex flex-col">
                          <span>{product.name}</span>
                          {product.sku && <span className="text-xs text-muted-foreground mt-0.5">SKU: {product.sku}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">{product.category}</td>
                      <td className="px-6 py-4 font-bold text-brand-pink">
                        ₹{product.price?.toFixed(2)}
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-muted-foreground line-through ml-2">₹{product.originalPrice.toFixed(2)}</span>
                        )}
                      </td>
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
                          <Link to={`/admin/products/edit/${product._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block">
                            <Edit size={18} />
                          </Link>
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
    </div>
  );
};

export default AdminProducts;

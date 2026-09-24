import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { cn } from '@/lib/utils';
import api from '../services/api';

const CATEGORIES_LIST = [
  'All', 'Birds', 'Cats', 'Dogs', 'Small Animals',
  'Bird Toys', 'Bird Stands', 'Cat Collars', 'Dog Leashes'
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory, page]);

  useEffect(() => {
    if (initialCategory !== selectedCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.getProducts({
        search, category: selectedCategory === 'All' ? '' : selectedCategory,
        minPrice: priceRange[0], maxPrice: priceRange[1], page, limit: 12
      });
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCategory = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
    const params = Object.fromEntries([...searchParams]);
    if (cat !== 'All') params.category = cat;
    else delete params.category;
    setSearchParams(params);
    setSidebarOpen(false);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between md:block">
        <h2 className="text-base font-bold text-foreground">Filters</h2>
        <button className="md:hidden p-1" onClick={() => setSidebarOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Categories</p>
        <div className="space-y-1">
          {CATEGORIES_LIST.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                selectedCategory === cat
                  ? "bg-brand-pink text-white font-semibold"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Price Range (₹)</p>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={5000}
            step={100}
            value={priceRange[1]}
            onChange={(e) => { setPriceRange([0, Number(e.target.value)]); setPage(1); }}
            className="w-full accent-brand-pink"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹0</span>
            <span className="font-semibold text-brand-pink">Up to ₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Button
        variant="outline-pink"
        size="sm"
        className="w-full"
        onClick={() => { setSelectedCategory('All'); setPriceRange([0, 5000]); setPage(1); setSearchParams({}); }}
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {search ? (
            <h1 className="text-2xl font-bold text-foreground">
              Search results for: <span className="text-brand-pink">"{search}"</span>
            </h1>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-foreground">
                {selectedCategory === 'All' ? 'All Products 🐾' : selectedCategory}
              </h1>
              {selectedCategory !== 'All' && (
                <Badge variant="pink" className="mt-1">{selectedCategory}</Badge>
              )}
            </>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="md:hidden gap-2"
          onClick={() => setSidebarOpen(true)}
        >
          <SlidersHorizontal size={15} /> Filters
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-24">
            <FilterPanel />
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-72 bg-white h-full shadow-xl p-5 overflow-y-auto animate-slide-in">
              <FilterPanel />
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 rounded-full border-4 border-brand-pink/20 border-t-brand-pink animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-3">🐾</div>
              <p className="text-xl font-bold text-foreground mb-2">No products found</p>
              <p className="text-muted-foreground mb-5">Try adjusting your filters or search terms.</p>
              <Button variant="outline-pink" onClick={() => { setSelectedCategory('All'); setPriceRange([0, 5000]); setSearchParams({}); }}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">{products.length} products found</p>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="group relative flex flex-col bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(233,30,140,0.12)] hover:border-brand-pink/25"
                  >
                    <div className="overflow-hidden" style={{ height: 200 }}>
                      <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-pink mb-1">{product.category}</p>
                      <h3 className="font-bold text-sm text-foreground line-clamp-2 leading-snug mb-2">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-auto">
                        <span className="text-xl font-extrabold text-brand-charcoal">₹{product.price?.toFixed(2)}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice?.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    ← Prev
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cn(
                        "w-9 h-9 rounded-lg text-sm font-semibold transition-all",
                        p === page ? "bg-brand-pink text-white" : "hover:bg-accent text-foreground"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next →
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;

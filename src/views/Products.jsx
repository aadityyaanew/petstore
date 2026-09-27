'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, SlidersHorizontal, X, ArrowRight, Check, ShoppingCart } from 'lucide-react';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ProductCard, { getProductImageUrl } from '../components/ProductCard';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamic filters will be computed from the database in the component



export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const search = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const petScrollRef = useRef(null);


  const { addToCart } = useCart();
  const { user } = useAuth();

  // Database Products
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Filters Computed from dbProducts
  const dynamicCategories = useMemo(() => {
    const cats = {};
    dbProducts.forEach(p => {
      if (p.category) {
        cats[p.category] = (cats[p.category] || 0) + 1;
      }
    });
    return Object.keys(cats).map(cat => ({ id: cat, label: cat, count: cats[cat] })).sort((a, b) => b.count - a.count);
  }, [dbProducts]);

  const dynamicTags = useMemo(() => {
    const tagSet = new Set();
    dbProducts.forEach(p => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach(t => tagSet.add(t));
      }
    });
    return Array.from(tagSet).sort();
  }, [dbProducts]);

  // Filters State
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : []);

  const [selectedTags, setSelectedTags] = useState([]);
  const [priceRange, setPriceRange] = useState(1000);
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(null);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setLoading(true);
        const res = await api.getProducts({ limit: 100 });
        const list = res.data?.products || [];
        if (list.length > 0) {
          setDbProducts(list);
        }
      } catch (err) {
        console.error('Failed to load products from database:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsData();
  }, []);



  const scrollPet = (direction) => {
    if (petScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      petScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryToggle = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
    setCurrentPage(1);
  };



  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const handleQuickAdd = async (product, e) => {
    e.stopPropagation();
    const pid = product._id || product.id;
    if (!user) {
      setAddedToast('Please log in to add items to your cart');
      navigate('/login');
      setTimeout(() => setAddedToast(null), 3000);
      return;
    }
    try {
      await addToCart(pid, 1);
      setAddedToast(`Added "${product.name || product.title}" to cart!`);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setAddedToast(err.response?.data?.message || 'Failed to add item to cart');
    }
    setTimeout(() => setAddedToast(null), 2500);
  };

  // Filtered & Sorted Products from Database or Fallback
  const filteredProducts = useMemo(() => {
    const source = dbProducts;
    return source.filter((p) => {
      const pName = p.name || p.title || '';
      const pCat = p.category || '';
      const pBrand = p.brand || '';
      const pPet = (p.petType || p.pet || '').toLowerCase();
      const pTags = Array.isArray(p.tags) ? p.tags : [];
      const pPrice = Number(p.price) || 0;

      if (search && !pName.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedPet && pPet && pPet !== selectedPet && !pTags.map(t => t.toLowerCase()).includes(selectedPet.toLowerCase())) {
        return false;
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(pCat)) return false;
      if (selectedTags.length > 0 && !pTags.some((t) => selectedTags.includes(t))) return false;
      if (pPrice > priceRange) return false;
      return true;
    }).sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      const nameA = a.name || a.title || '';
      const nameB = b.name || b.title || '';
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'name') return nameA.localeCompare(nameB);
      return 0;
    });
  }, [dbProducts, search, selectedPet, selectedCategories, selectedTags, priceRange, sortBy]);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="relative w-full min-h-screen bg-white text-gray-900 pb-16 selection:bg-[#E050D0]/20 selection:text-[#E050D0] overflow-hidden">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-full shadow-2xl text-sm font-semibold flex items-center gap-2 animate-bounce">
          <span></span>
          <span>{addedToast}</span>
        </div>
      )}


      {/* ─────────────────────────────────────────────────────────────
          3. MAIN CATALOG AREA: SIDEBAR FILTERS + REAL PRODUCTS GRID
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">

        {/* Mobile Filter & Sort Control Bar */}
        <div className="flex md:hidden flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500">
            {paginatedProducts.length} of {filteredProducts.length} items
          </p>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 text-xs font-semibold rounded-full px-3 py-1.5 text-gray-700 outline-none focus:border-[#E050D0] cursor-pointer shadow-sm"
            >
              <option value="latest">Latest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">A to Z</option>
            </select>

            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <SlidersHorizontal size={13} className="text-[#E050D0]" />
              <span>Filters</span>
              {(selectedCategories.length > 0 || selectedTags.length > 0 || priceRange < 159) && (
                <span className="w-2 h-2 rounded-full bg-[#E050D0]" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start relative">

          {/* ── LEFT SIDEBAR FILTERS (Desktop) ── */}
          <aside className="hidden md:block md:col-span-4 lg:col-span-3 space-y-8 pr-4 sticky top-24 self-start">

            {/* 1. Filter by categories */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-4 border-b pb-2">
                Categories
              </h3>
              <div className="space-y-2.5">
                {dynamicCategories.length === 0 && <p className="text-xs text-muted-foreground">No categories found.</p>}
                {dynamicCategories.map((cat) => {
                  const checked = selectedCategories.includes(cat.id);
                  return (
                    <label
                      key={cat.id}
                      onClick={() => handleCategoryToggle(cat.id)}
                      className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "w-4 h-4 rounded-sm border flex items-center justify-center transition-colors",
                            checked
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-input group-hover:border-primary"
                          )}
                        >
                          {checked && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span>{cat.label}</span>
                      </div>
                      <span className="text-muted-foreground text-xs bg-secondary px-2 py-0.5 rounded-full">
                        {cat.count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. Filter by Price */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-4 border-b pb-2">
                Max Price
              </h3>
              <input
                type="range"
                min={1}
                max={1000}
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs font-semibold text-muted-foreground">
                  ₹1 - ₹{priceRange}
                </span>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1 rounded-md transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>


            {/* 3. Filter by tags */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 border-b pb-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {dynamicTags.length === 0 && <p className="text-xs text-muted-foreground">No tags found.</p>}
                {dynamicTags.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={cn(
                        "text-xs font-medium px-3 py-1 rounded-md border transition-colors cursor-pointer",
                        active
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-input hover:border-primary hover:text-primary"
                      )}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Popular products (Real Images) */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-4 border-b pb-2">
                Popular products
              </h3>
              <div className="space-y-3.5">
                {dbProducts.slice(0, 5).map((prod) => {
                  const pid = prod._id || prod.id;
                  const firstImg = prod.images?.[0];
                  const rawImage = (typeof firstImg === 'object' && firstImg !== null ? firstImg?.url : firstImg) || prod.image;
                  const finalImage = (rawImage && rawImage !== '[object Object]') ? rawImage : '/assets/placeholder-product.png';
                  const imageSrc = finalImage.startsWith('http') || finalImage.startsWith('/') ? finalImage : `${BASE_URL}${finalImage}`;
                  return (
                    <div
                      key={pid}
                      onClick={() => navigate(`/product/${pid}`)}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-md bg-background border border-input overflow-hidden shrink-0 transition-colors p-0.5">
                        <img
                          src={imageSrc}
                          alt={prod.name}
                          className="w-full h-full object-cover rounded-sm group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-1">
                          {prod.name}
                        </h4>
                        <p className="text-xs font-bold text-muted-foreground mt-0.5">
                          ₹{(prod.price || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* ── MOBILE SIDEBAR OVERLAY ── */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
              <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl p-5 overflow-y-auto space-y-5 safe-bottom">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-[#E050D0]" />
                    <h3 className="font-extrabold text-base text-gray-900">Filters</h3>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-400 hover:text-gray-900 cursor-pointer">
                    <X size={20} />
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2.5">Categories</h4>
                  <div className="space-y-1.5">
                    {dynamicCategories.map((c) => {
                      const checked = selectedCategories.includes(c.id);
                      return (
                        <div
                          key={c.id}
                          onClick={() => handleCategoryToggle(c.id)}
                          className={cn(
                            "flex items-center justify-between text-xs py-1.5 px-2.5 rounded-md cursor-pointer transition-colors",
                            checked ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-secondary"
                          )}
                        >
                          <span className="flex items-center gap-2">
                            {checked && <Check size={12} strokeWidth={3} />}
                            {c.label}
                          </span>
                          <span className="text-[11px] font-semibold bg-secondary px-1.5 rounded-sm">{c.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Price Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Price Range</h4>
                    <span className="text-xs font-bold text-muted-foreground">₹{priceRange}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={1000}
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>₹1</span>
                    <span>₹1000</span>
                  </div>
                </div>


                {/* Tags */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {dynamicTags.map((tag) => {
                      const active = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={cn(
                            "text-[11px] font-medium px-2.5 py-1 rounded-md border transition-colors cursor-pointer",
                            active
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-muted-foreground border-input"
                          )}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="w-full py-3 bg-[#E050D0] hover:bg-[#C035B0] text-white font-bold text-xs rounded-full shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategories([]);
                      setSelectedTags([]);
                      setPriceRange(159);
                      setSelectedPet('');
                      setSidebarOpen(false);
                    }}
                    className="w-full py-2 text-center text-xs font-semibold text-gray-500 hover:text-gray-900 cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── RIGHT MAIN PRODUCT GRID (Real Asset Photography) ── */}
          <div className="md:col-span-8 lg:col-span-9">

            {/* Header: Results Count + Sort dropdown (Desktop/Tablet) */}
            <div className="hidden sm:flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500">
                Showing {Math.min(paginatedProducts.length, itemsPerPage)} of {filteredProducts.length} results
              </p>

              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 text-xs font-semibold rounded-lg px-3 py-1.5 text-gray-700 outline-none focus:border-[#E050D0] cursor-pointer"
                >
                  <option value="latest">Sort by latest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* 2-3 Columns Grid using REAL Asset Photography */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="bg-card rounded-lg p-3 sm:p-5 border shadow-sm relative group flex flex-col justify-between">
                    <Skeleton className="w-full aspect-square rounded-md mb-3" />
                    <div className="pt-2 flex flex-col justify-between border-t border-border/50 gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <div className="mt-3">
                      <Skeleton className="h-9 w-full rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-16 sm:py-20 bg-muted/30 rounded-xl border border-border">

                <h3 className="font-semibold text-base text-foreground mb-1">No products match your filters</h3>
                <p className="text-xs text-muted-foreground mb-4">Try clearing some filters to see more items.</p>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedTags([]);
                    setPriceRange(1000);
                    setSelectedPet('');
                  }}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {paginatedProducts.map((prod) => {
                  const pid = prod._id || prod.id;
                  const imageSrc = getProductImageUrl(prod);
                  return (
                    <div
                      key={pid}
                      onClick={() => navigate(`/product/${pid}`)}
                      className="bg-card rounded-lg p-3 sm:p-5 border shadow-sm relative group flex flex-col justify-between transition-all duration-300 hover:shadow-md cursor-pointer"
                    >
                      {/* Product Real Photo Area */}
                      <div className="py-2 sm:py-4 flex items-center justify-center aspect-square bg-white rounded-md overflow-hidden mb-3">
                        <img
                          src={imageSrc}
                          alt={prod.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Footer: Title + Price on left, Wishlist Heart on right */}
                      <div className="pt-2 flex flex-col justify-between border-t border-border/50">
                        <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors leading-tight mb-1 line-clamp-1">
                          {prod.name}
                        </h3>
                        <p className="font-bold text-sm text-foreground">
                          ₹{(prod.price || 0).toFixed(2)}
                        </p>
                      </div>

                      {/* Quick Add */}
                      <div className="mt-3">
                        <button
                          onClick={(e) => handleQuickAdd(prod, e)}
                          className="w-full py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium transition-colors shadow-sm active:scale-95 cursor-pointer"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </section>

    </div>
  );
}

'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, SlidersHorizontal, X, ArrowRight, Check, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { cn } from '@/lib/utils';

const BIRD_TYPES = [
  { id: 'parrot', name: 'Parrot', image: '/assets/birds/parrot.jpg' },
  { id: 'cockatiel', name: 'Cockatiel', image: '/assets/birds/cockatiel.jpg' },
  { id: 'budgie', name: 'Budgie', image: '/assets/birds/budgie.jpg' },
  { id: 'conure', name: 'Sun Conure', image: '/assets/birds/conure.jpg' },
  { id: 'lovebird', name: 'Lovebird', image: '/assets/birds/lovebird.jpg' },
  { id: 'canary', name: 'Canary', image: '/assets/birds/canary.jpg' },
];

const CATEGORIES_FILTER = [
  { id: 'Furniture', label: 'Furniture', count: 27 },
  { id: 'Bowls', label: 'Bowls & Feeders', count: 20 },
  { id: 'Clothing', label: 'Accessories', count: 18 },
  { id: 'Food', label: 'Food & Nutrition', count: 20 },
  { id: 'Toys', label: 'Toys & Gyms', count: 8 },
  { id: 'Sale', label: 'Sale', count: 12 },
];

const BRANDS_FILTER = [
  { id: 'Poonch', label: 'Poonch Original', count: 20 },
  { id: 'Natural Pine', label: 'Natural Pine', count: 16 },
  { id: 'Pet Spot', label: 'Pet Spot', count: 12 },
  { id: 'EcoWood', label: 'EcoWood', count: 11 },
  { id: 'Green Line', label: 'Green Line', count: 12 },
];

const FILTER_TAGS = ['Bird stands', 'Wooden toys', 'Natural wood', 'Parrot', 'Small pets', 'Chew toys'];

const POPULAR_SIDEBAR_PRODUCTS = [
  { id: 'pop-1', name: 'Ring Puzzle Game', price: 14.99, image: '/assets/asset-bff48261.jpeg' },
  { id: 'pop-2', name: 'Pine Play Gym Stand', price: 34.99, image: '/assets/asset-4cbbe7b6.jpeg' },
  { id: 'pop-3', name: 'Beaded Perch Swing', price: 12.99, image: '/assets/asset-6ebb9cd6.jpeg' },
  { id: 'pop-4', name: 'Tabletop Gym & Feeder', price: 29.99, image: '/assets/asset-fcc4ef82.jpeg' },
  { id: 'pop-5', name: 'Natural T-Perch Set', price: 18.50, image: '/assets/asset-675fd014.jpeg' },
];

const SHOP_CATALOG = [
  {
    id: 'prod-1',
    name: 'Tabletop Wooden Play Gym',
    price: 34.99,
    category: 'Toys',
    pet: 'parrot',
    brand: 'Poonch',
    tags: ['Bird stands', 'Natural wood'],
    image: '/assets/asset-4cbbe7b6.jpeg',
  },
  {
    id: 'prod-2',
    name: 'Multi-Perch Gym with Feeder Cup',
    price: 29.99,
    category: 'Bowls',
    pet: 'parrot',
    brand: 'Poonch',
    tags: ['Bird stands', 'Parrot'],
    image: '/assets/asset-fcc4ef82.jpeg',
  },
  {
    id: 'prod-3',
    name: 'Natural Pine Ring Toss Game',
    price: 14.99,
    category: 'Toys',
    pet: 'parrot',
    brand: 'Natural Pine',
    tags: ['Wooden toys', 'Small pets'],
    image: '/assets/asset-bff48261.jpeg',
  },
  {
    id: 'prod-4',
    name: 'Beaded Arch Swing with Brass Bells',
    price: 12.99,
    category: 'Toys',
    pet: 'parrot',
    brand: 'Poonch',
    tags: ['Wooden toys', 'Parrot'],
    image: '/assets/asset-6ebb9cd6.jpeg',
  },
  {
    id: 'prod-5',
    name: 'Natural Wood T-Perch Set (3 Pcs)',
    price: 18.50,
    category: 'Furniture',
    pet: 'parrot',
    brand: 'Natural Pine',
    tags: ['Natural wood', 'Bird stands'],
    image: '/assets/asset-675fd014.jpeg',
  },
  {
    id: 'prod-6',
    name: 'Stainless Chain Hanging Swing',
    price: 15.99,
    category: 'Toys',
    pet: 'parrot',
    brand: 'Poonch',
    tags: ['Wooden toys', 'Parrot'],
    image: '/assets/asset-6763452a.jpeg',
  },
  {
    id: 'prod-7',
    name: 'Solid Pine Climbing Ladder',
    price: 16.99,
    category: 'Toys',
    pet: 'parrot',
    brand: 'EcoWood',
    tags: ['Wooden toys', 'Natural wood'],
    image: '/assets/asset-8929307d.jpeg',
  },
  {
    id: 'prod-8',
    name: 'Compact Tabletop Activity Bridge',
    price: 13.99,
    category: 'Furniture',
    pet: 'hamster',
    brand: 'Natural Pine',
    tags: ['Small pets', 'Natural wood'],
    image: '/assets/asset-e78dd216.jpeg',
  },
  {
    id: 'prod-9',
    name: 'Brain Game Training Base',
    price: 19.44,
    category: 'Toys',
    pet: 'parrot',
    brand: 'Poonch',
    tags: ['Wooden toys', 'Chew toys'],
    image: '/assets/asset-70343c4c.jpeg',
  },
  {
    id: 'prod-10',
    name: 'Multi-Level Activity Gym Stand',
    price: 38.00,
    category: 'Furniture',
    pet: 'parrot',
    brand: 'Poonch',
    tags: ['Bird stands', 'Parrot'],
    image: '/assets/asset-7cf3d705.jpeg',
  },
  {
    id: 'prod-11',
    name: 'Handcrafted Woolen Pet Collar',
    price: 19.11,
    category: 'Clothing',
    pet: 'cat',
    brand: 'Pet Spot',
    tags: ['Small pets', 'Cat'],
    image: '/assets/categories/accessories.jpg',
  },
  {
    id: 'prod-12',
    name: 'Breathable Travel Pet Carrier',
    price: 45.00,
    category: 'Furniture',
    pet: 'dog',
    brand: 'Green Line',
    tags: ['Small pets'],
    image: '/assets/categories/bags.jpg',
  },
  // Page 2 Products
  {
    id: 'prod-13',
    name: 'Curious Bird Ring Intelligence Game',
    price: 16.50,
    category: 'Toys',
    pet: 'parrot',
    brand: 'Poonch',
    tags: ['Wooden toys'],
    image: '/assets/asset-b7038046.jpeg',
  },
  {
    id: 'prod-14',
    name: 'All-in-One Training & Gym Station',
    price: 42.00,
    category: 'Furniture',
    pet: 'parrot',
    brand: 'Poonch',
    tags: ['Bird stands'],
    image: '/assets/asset-bafedd16.jpeg',
  },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const search = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const petScrollRef = useRef(null);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Database Products
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedPet, setSelectedPet] = useState(initialCategory.toLowerCase() || 'parrot');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [priceRange, setPriceRange] = useState(159);
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

  useEffect(() => {
    if (initialCategory) {
      const matchPet = BIRD_TYPES.find((p) => p.name.toLowerCase() === initialCategory.toLowerCase());
      if (matchPet) setSelectedPet(matchPet.id);
    }
  }, [initialCategory]);

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

  const handleBrandToggle = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId) ? prev.filter((b) => b !== brandId) : [...prev, brandId]
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
    const source = dbProducts.length > 0 ? dbProducts : SHOP_CATALOG;
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
      if (selectedBrands.length > 0 && !selectedBrands.includes(pBrand)) return false;
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
  }, [dbProducts, search, selectedPet, selectedCategories, selectedBrands, selectedTags, priceRange, sortBy]);

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
              {(selectedCategories.length > 0 || selectedBrands.length > 0 || selectedTags.length > 0 || priceRange < 159) && (
                <span className="w-2 h-2 rounded-full bg-[#E050D0]" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* ── LEFT SIDEBAR FILTERS (Desktop) ── */}
          <aside className="hidden md:block md:col-span-4 lg:col-span-3 space-y-8 pr-2">

            {/* 1. Filter by categories */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-4">
                Filter by categories
              </h3>
              <div className="space-y-2.5">
                {CATEGORIES_FILTER.map((cat) => {
                  const checked = selectedCategories.includes(cat.id);
                  return (
                    <label
                      key={cat.id}
                      onClick={() => handleCategoryToggle(cat.id)}
                      className="flex items-center justify-between text-xs sm:text-sm text-gray-600 hover:text-gray-900 cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                            checked
                              ? "bg-[#E050D0] border-[#E050D0] text-white"
                              : "border-gray-300 group-hover:border-[#E050D0]"
                          )}
                        >
                          {checked && <Check size={11} strokeWidth={3} />}
                        </div>
                        <span>{cat.label}</span>
                      </div>
                      <span className="text-[#E050D0] font-semibold text-xs">
                        {cat.count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. Filter by Price */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-4">
                Filter by Price
              </h3>
              <input
                type="range"
                min={1}
                max={159}
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E050D0]"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs font-semibold text-gray-500">
                  Price: $1 - ${priceRange}
                </span>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="bg-black hover:bg-neutral-800 text-white text-[11px] font-bold px-3.5 py-1 rounded-full shadow-sm transition-all cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* 3. Filter by brands */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-4">
                Filter by brands
              </h3>
              <div className="space-y-2.5">
                {BRANDS_FILTER.map((b) => {
                  const checked = selectedBrands.includes(b.id);
                  return (
                    <label
                      key={b.id}
                      onClick={() => handleBrandToggle(b.id)}
                      className="flex items-center justify-between text-xs sm:text-sm text-gray-600 hover:text-gray-900 cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                            checked
                              ? "bg-[#E050D0] border-[#E050D0] text-white"
                              : "border-gray-300 group-hover:border-[#E050D0]"
                          )}
                        >
                          {checked && <Check size={11} strokeWidth={3} />}
                        </div>
                        <span className="truncate max-w-[130px]">{b.label}</span>
                      </div>
                      <span className="text-[#E050D0] font-semibold text-xs">
                        {b.count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 4. Filter by tags */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-3">
                Filter by tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {FILTER_TAGS.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={cn(
                        "text-xs font-semibold px-3 py-1 rounded-full border transition-all cursor-pointer",
                        active
                          ? "bg-[#E050D0] text-white border-[#E050D0] shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#E050D0] hover:text-[#E050D0]"
                      )}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Popular products (Real Images) */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-4">
                Popular products
              </h3>
              <div className="space-y-3.5">
                {(dbProducts.length > 0 ? dbProducts.slice(0, 5) : POPULAR_SIDEBAR_PRODUCTS).map((prod) => {
                  const pid = prod._id || prod.id;
                  const imageSrc = prod.images?.[0] || prod.image || '/assets/asset-bff48261.jpeg';
                  return (
                    <div
                      key={pid}
                      onClick={() => navigate(`/product/${pid}`)}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 overflow-hidden shrink-0 group-hover:border-[#E050D0]/30 transition-colors p-1">
                        <img
                          src={imageSrc}
                          alt={prod.name}
                          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#E050D0] transition-colors leading-tight line-clamp-1">
                          {prod.name}
                        </h4>
                        <p className="text-xs font-extrabold text-gray-900 mt-0.5">
                          ${(prod.price || 0).toFixed(2)}
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
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#E050D0] mb-2.5">Categories</h4>
                  <div className="space-y-1.5">
                    {CATEGORIES_FILTER.map((c) => {
                      const checked = selectedCategories.includes(c.id);
                      return (
                        <div
                          key={c.id}
                          onClick={() => handleCategoryToggle(c.id)}
                          className={cn(
                            "flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg cursor-pointer transition-colors",
                            checked ? "bg-[#E050D0]/10 text-[#E050D0] font-bold" : "text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          <span className="flex items-center gap-2">
                            {checked && <Check size={12} strokeWidth={3} />}
                            {c.label}
                          </span>
                          <span className="text-[11px] font-semibold opacity-75">{c.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Price Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#E050D0]">Price Range</h4>
                    <span className="text-xs font-bold text-gray-800">${priceRange}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={159}
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E050D0]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>$1</span>
                    <span>$159</span>
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#E050D0] mb-2.5">Brands</h4>
                  <div className="space-y-1.5">
                    {BRANDS_FILTER.map((b) => {
                      const checked = selectedBrands.includes(b.id);
                      return (
                        <div
                          key={b.id}
                          onClick={() => handleBrandToggle(b.id)}
                          className={cn(
                            "flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg cursor-pointer transition-colors",
                            checked ? "bg-[#E050D0]/10 text-[#E050D0] font-bold" : "text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          <span className="flex items-center gap-2">
                            {checked && <Check size={12} strokeWidth={3} />}
                            {b.label}
                          </span>
                          <span className="text-[11px] font-semibold opacity-75">{b.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#E050D0] mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {FILTER_TAGS.map((tag) => {
                      const active = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={cn(
                            "text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer",
                            active
                              ? "bg-[#E050D0] text-white border-[#E050D0]"
                              : "bg-gray-50 text-gray-600 border-gray-200"
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
                      setSelectedBrands([]);
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
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-16 sm:py-20 bg-[#F9FAFB] rounded-3xl border border-gray-100">
                <p className="text-4xl mb-2">🦜</p>
                <h3 className="font-extrabold text-base text-gray-900 mb-1">No products match your filters</h3>
                <p className="text-xs text-gray-500 mb-4">Try clearing some filters to see more items.</p>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedBrands([]);
                    setSelectedTags([]);
                    setPriceRange(159);
                    setSelectedPet('');
                  }}
                  className="text-xs font-bold text-[#E050D0] hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
                {paginatedProducts.map((prod) => {
                  const pid = prod._id || prod.id;
                  const wishlisted = isInWishlist(pid);
                  const imageSrc = prod.images?.[0] || prod.image || '/assets/asset-4cbbe7b6.jpeg';
                  return (
                    <div
                      key={pid}
                      onClick={() => navigate(`/product/${pid}`)}
                      className="bg-[#F8F9FA] rounded-[20px] sm:rounded-[28px] p-3 xs:p-4 sm:p-6 border border-gray-100/90 relative group flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer"
                    >
                      {/* Product Real Photo Area */}
                      <div className="py-2 sm:py-4 flex items-center justify-center h-32 xs:h-40 sm:h-52 bg-white rounded-2xl overflow-hidden p-2 mb-2 sm:mb-3">
                        <img
                          src={imageSrc}
                          alt={prod.name}
                          className="w-full h-full object-contain transform group-hover:scale-108 transition-transform duration-500"
                        />
                      </div>

                      {/* Footer: Title + Price on left, Wishlist Heart on right */}
                      <div className="pt-2 sm:pt-3 flex items-end justify-between border-t border-gray-200/50">
                        <div className="pr-1">
                          <h3 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#E050D0] transition-colors leading-tight mb-0.5 sm:mb-1 line-clamp-1">
                            {prod.name}
                          </h3>
                          <p className="font-extrabold text-xs sm:text-sm text-gray-900">
                            ${(prod.price || 0).toFixed(2)}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(prod);
                          }}
                          className={cn(
                            "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-110 shrink-0",
                            wishlisted
                              ? "bg-[#E050D0] text-white"
                              : "text-[#E050D0] hover:bg-[#E050D0]/10"
                          )}
                          aria-label="Save to wishlist"
                          title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                          <Heart size={15} strokeWidth={2} fill={wishlisted ? "currentColor" : "none"} />
                        </button>
                      </div>

                      {/* Quick Add (Visible on Mobile Touch, Hover on Desktop) */}
                      <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 mt-2">
                        <button
                          onClick={(e) => handleQuickAdd(prod, e)}
                          className="w-full py-1.5 sm:py-2 rounded-full bg-black hover:bg-neutral-800 text-white text-[10px] sm:text-[11px] font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
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

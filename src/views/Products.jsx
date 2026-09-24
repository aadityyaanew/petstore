'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, SlidersHorizontal, X, ArrowRight, Check, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { cn } from '@/lib/utils';

const PET_TYPES = [
  { id: 'cat', name: 'Cat', image: '/assets/categories/accessories.jpg' },
  { id: 'hamster', name: 'Hamster', image: '/assets/asset-70343c4c.jpeg' },
  { id: 'dog', name: 'Dog', image: '/assets/categories/food.jpg' },
  { id: 'parrot', name: 'Parrot', image: '/assets/asset-6ebb9cd6.jpeg' },
  { id: 'rabbit', name: 'Rabbit', image: '/assets/categories/bags.jpg' },
  { id: 'turtle', name: 'Turtle', image: '/assets/categories/furniture.jpg' },
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
    if (initialCategory) {
      const matchPet = PET_TYPES.find((p) => p.name.toLowerCase() === initialCategory.toLowerCase());
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
    try {
      await addToCart(product.id, 1);
      setAddedToast(`Added "${product.name}" to cart!`);
    } catch {
      setAddedToast(`Added "${product.name}" to cart!`);
    }
    setTimeout(() => setAddedToast(null), 2500);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return SHOP_CATALOG.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
      if (selectedTags.length > 0 && !p.tags.some((t) => selectedTags.includes(t))) return false;
      if (p.price > priceRange) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [search, selectedCategories, selectedBrands, selectedTags, priceRange, sortBy]);

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
          <span>🐾</span>
          <span>{addedToast}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          DECORATIVE ORGANIC PINK BLOBS
      ───────────────────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute top-[90px] -left-12 sm:-left-10 w-20 h-44 sm:w-24 sm:h-56 rounded-r-full bg-[#E050D0] opacity-90 blur-[0.5px] z-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-10 left-[28%] w-16 h-12 sm:w-20 sm:h-14 rounded-[45%_55%_65%_35%] bg-[#E050D0] opacity-85 z-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-[430px] left-[39%] w-16 h-12 sm:w-20 sm:h-14 rounded-[50%_60%_40%_50%] bg-[#E050D0] opacity-85 z-0"
        aria-hidden="true"
      />

      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Real Asset Photography in Organic Pink Frame)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-4 pb-10 sm:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col items-start pt-4 sm:pt-6">
              <span className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#E050D0] mb-3 inline-block">
                Pet Shop
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold tracking-tight text-gray-900 leading-[1.12] mb-5">
                The friendly and caring small pet store
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed max-w-xl">
                At et vehicula sodales est proin turpis pellentesque sinulla a aliquam amet rhoncus quisque eget sit.
              </p>
            </div>

            {/* Right Graphic: Real Asset Image framed in Organic Pink Backdrop */}
            <div className="lg:col-span-6 flex items-center justify-center relative">
              <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-[36px] overflow-hidden shadow-2xl ring-4 ring-[#E050D0]/25 group">
                <img
                  src="/assets/asset-2e913e5e.jpeg"
                  alt="Happy pet with wooden stand"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FBA8FA]">100% Handcrafted</span>
                    <p className="text-base font-extrabold leading-tight">Natural Pine Bird Stands</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#E050D0] text-xs font-bold shadow-md">
                    Shop Now
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. SHOP BY PET (Real Asset Avatars with Cat Active in Pink)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            Shop by pet
          </h2>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => scrollPet('left')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 active:scale-95 transition-all shadow-sm cursor-pointer"
              aria-label="Previous pets"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => scrollPet('right')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 active:scale-95 transition-all shadow-sm cursor-pointer"
              aria-label="Next pets"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* 6 Circular Real Image Avatars */}
        <div
          ref={petScrollRef}
          className="flex items-center justify-between gap-6 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-2"
        >
          {PET_TYPES.map((pet) => {
            const isSelected = selectedPet === pet.id;
            return (
              <div
                key={pet.id}
                onClick={() => {
                  setSelectedPet(isSelected ? '' : pet.id);
                }}
                className="flex flex-col items-center gap-3 cursor-pointer group shrink-0 min-w-[90px] sm:min-w-[110px]"
              >
                {/* Circular Photo Avatar Container */}
                <div
                  className={cn(
                    "w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden transition-all duration-300 transform group-hover:scale-105 p-1",
                    isSelected
                      ? "ring-4 ring-[#E050D0] shadow-[0_8px_25px_rgba(224,80,208,0.4)]"
                      : "ring-2 ring-gray-100 group-hover:ring-gray-300"
                  )}
                >
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <span
                  className={cn(
                    "text-xs sm:text-sm font-bold transition-colors",
                    isSelected ? "text-[#E050D0]" : "text-gray-500 group-hover:text-gray-900"
                  )}
                >
                  {pet.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN CATALOG AREA: SIDEBAR FILTERS + REAL PRODUCTS GRID
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Mobile Filter Toggle */}
        <div className="flex md:hidden items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500">
            Showing {paginatedProducts.length} of {filteredProducts.length} results
          </p>
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-xs font-bold shadow-sm"
          >
            <SlidersHorizontal size={14} className="text-[#E050D0]" />
            <span>Filters</span>
          </button>
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
                {POPULAR_SIDEBAR_PRODUCTS.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => navigate('/products')}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 overflow-hidden shrink-0 group-hover:border-[#E050D0]/30 transition-colors p-1">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#E050D0] transition-colors leading-tight line-clamp-1">
                        {prod.name}
                      </h4>
                      <p className="text-xs font-extrabold text-gray-900 mt-0.5">
                        ${prod.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>

          {/* ── MOBILE SIDEBAR OVERLAY ── */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
              <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="font-extrabold text-lg text-gray-900">Filters</h3>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-500">
                    <X size={20} />
                  </button>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#E050D0] mb-3">Categories</h4>
                  <div className="space-y-2">
                    {CATEGORIES_FILTER.map((c) => (
                      <div key={c.id} onClick={() => handleCategoryToggle(c.id)} className="flex items-center justify-between text-xs py-1">
                        <span>{c.label}</span>
                        <span className="text-[#E050D0] font-bold">{c.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#E050D0] mb-2">Price Up to ${priceRange}</h4>
                  <input
                    type="range"
                    min={1}
                    max={159}
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#E050D0]"
                  />
                </div>

                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-full py-3 bg-[#E050D0] text-white font-bold text-xs rounded-full shadow-md"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* ── RIGHT MAIN PRODUCT GRID (Real Asset Photography) ── */}
          <div className="md:col-span-8 lg:col-span-9">
            
            {/* Header: Results Count + Sort dropdown */}
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

            {/* 3 Columns Grid using REAL Asset Photography */}
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-20 bg-[#F9FAFB] rounded-3xl border border-gray-100">
                <p className="text-4xl mb-2">🐾</p>
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
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {paginatedProducts.map((prod) => {
                  const wishlisted = isInWishlist(prod.id);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => navigate('/products')}
                      className="bg-[#F8F9FA] rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 border border-gray-100/90 relative group flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer"
                    >
                      {/* Product Real Photo Area */}
                      <div className="py-4 flex items-center justify-center h-44 sm:h-52 bg-white rounded-2xl overflow-hidden p-2 mb-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-contain transform group-hover:scale-108 transition-transform duration-500"
                        />
                      </div>

                      {/* Footer: Title + Price on left, Wishlist Heart on right */}
                      <div className="pt-3 flex items-end justify-between border-t border-gray-200/50">
                        <div>
                          <h3 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#E050D0] transition-colors leading-tight mb-1 line-clamp-1">
                            {prod.name}
                          </h3>
                          <p className="font-extrabold text-xs sm:text-sm text-gray-900">
                            ${prod.price.toFixed(2)}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(prod);
                          }}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-110 shrink-0",
                            wishlisted
                              ? "bg-[#E050D0] text-white"
                              : "text-[#E050D0] hover:bg-[#E050D0]/10"
                          )}
                          aria-label="Save to wishlist"
                          title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                          <Heart size={16} strokeWidth={2} fill={wishlisted ? "currentColor" : "none"} />
                        </button>
                      </div>

                      {/* Quick Add on Hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2">
                        <button
                          onClick={(e) => handleQuickAdd(prod, e)}
                          className="w-full py-2 rounded-full bg-black hover:bg-neutral-800 text-white text-[11px] font-bold transition-all shadow-sm"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── PAGINATION ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 sm:mt-16">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "w-8 h-8 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer",
                        isActive
                          ? "bg-[#E050D0] text-white"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-3.5 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-all shadow-sm cursor-pointer"
                  >
                    Next &gt;
                  </button>
                )}
              </div>
            )}

          </div>

        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. TWO WIDE REAL ASSET BANNERS (Poonch Pet Store Photography)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Banner 1: Real Wide Photography Banner */}
          <div
            onClick={() => navigate('/products')}
            className="group relative rounded-[28px] sm:rounded-[36px] overflow-hidden aspect-[16/9] shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <img
              src="/assets/asset-7a6e49e8.jpeg"
              alt="Premium Wooden Bird Toys & Accessories"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Banner 2: Real Wide Photography Banner */}
          <div
            onClick={() => navigate('/products')}
            className="group relative rounded-[28px] sm:rounded-[36px] overflow-hidden aspect-[16/9] shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <img
              src="/assets/asset-8daaef0d.jpeg"
              alt="Handmade with Natural Pine Wood"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

        </div>
      </section>

    </div>
  );
}

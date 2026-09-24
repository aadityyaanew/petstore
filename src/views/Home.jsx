'use client';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, ArrowRight } from 'lucide-react';
import BrandPartners from '../components/BrandPartners';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { cn } from '@/lib/utils';

const CATEGORIES_DATA = [
  {
    id: 'accessories',
    title: 'Accessories',
    count: '84 products',
    image: '/assets/categories/accessories.jpg',
    link: '/products?category=Accessories',
  },
  {
    id: 'food',
    title: 'Food',
    count: '64 products',
    image: '/assets/categories/food.jpg',
    link: '/products?category=Food',
  },
  {
    id: 'furniture',
    title: 'Furniture',
    count: '22 products',
    image: '/assets/categories/furniture.jpg',
    link: '/products?category=Furniture',
  },
  {
    id: 'bags',
    title: 'Bags',
    count: '16 products',
    image: '/assets/categories/bags.jpg',
    link: '/products?category=Bags',
  },
];

const FEATURED_PRODUCTS = [
  {
    id: 'feat-1',
    name: 'Tabletop Wooden Play Gym',
    price: 34.99,
    category: 'Toys',
    image: '/assets/asset-4cbbe7b6.jpeg',
  },
  {
    id: 'feat-2',
    name: 'Multi-Perch Gym & Feeder Cup',
    price: 29.99,
    category: 'Bowls',
    image: '/assets/asset-fcc4ef82.jpeg',
  },
  {
    id: 'feat-3',
    name: 'Natural Pine Ring Toss Game',
    price: 14.99,
    category: 'Toys',
    image: '/assets/asset-bff48261.jpeg',
  },
];

const BEST_SELLING_PRODUCTS = [
  {
    id: 'best-1',
    name: 'Natural Pine Ring Toss Game',
    price: 14.99,
    category: 'Toys',
    image: '/assets/asset-bff48261.jpeg',
  },
  {
    id: 'best-2',
    name: 'Tabletop Wooden Play Gym',
    price: 34.99,
    category: 'Toys',
    image: '/assets/asset-4cbbe7b6.jpeg',
  },
  {
    id: 'best-3',
    name: 'Beaded Perch Arch Swing',
    price: 12.99,
    category: 'Toys',
    image: '/assets/asset-6ebb9cd6.jpeg',
  },
  {
    id: 'best-4',
    name: 'Multi-Perch Gym & Feeder Cup',
    price: 29.99,
    category: 'Bowls',
    image: '/assets/asset-fcc4ef82.jpeg',
  },
  {
    id: 'best-5',
    name: 'Natural Wood T-Perch Set (3 Pcs)',
    price: 18.50,
    category: 'Furniture',
    image: '/assets/asset-675fd014.jpeg',
  },
  {
    id: 'best-6',
    name: 'Solid Pine Climbing Ladder',
    price: 16.99,
    category: 'Toys',
    image: '/assets/asset-8929307d.jpeg',
  },
  {
    id: 'best-7',
    name: 'Stainless Chain Hanging Swing',
    price: 15.99,
    category: 'Toys',
    image: '/assets/asset-6763452a.jpeg',
  },
  {
    id: 'best-8',
    name: 'Hardwood Suspension Bridge',
    price: 17.50,
    category: 'Toys',
    image: '/assets/asset-e78dd216.jpeg',
  },
];

const PET_TYPES = [
  { id: 'cat', name: 'Cat', image: '/assets/categories/accessories.jpg' },
  { id: 'hamster', name: 'Hamster', image: '/assets/asset-70343c4c.jpeg' },
  { id: 'dog', name: 'Dog', image: '/assets/categories/food.jpg' },
  { id: 'parrot', name: 'Parrot', image: '/assets/asset-6ebb9cd6.jpeg' },
  { id: 'rabbit', name: 'Rabbit', image: '/assets/categories/bags.jpg' },
  { id: 'turtle', name: 'Turtle', image: '/assets/categories/furniture.jpg' },
];

const BLOG_POSTS = [
  {
    id: 1,
    tag: 'News',
    date: '24 May 2024',
    title: 'Urna Cras Et Mauris Congue Nunc Nisl Nisi Tempus Cursus',
    image: '/assets/asset-bafedd16.jpeg',
  },
  {
    id: 2,
    tag: 'News',
    date: '24 May 2024',
    title: 'Id Tellus Dignissim In Nisi Aliquam. Malesuada Interdum',
    image: '/assets/asset-b7038046.jpeg',
  },
  {
    id: 3,
    tag: 'News',
    date: '24 May 2024',
    title: 'Mus Cursus Pellentesque Blandit Tortor Suspendisse Ornare',
    image: '/assets/asset-f3942b3d.jpeg',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const categoryScrollRef = useRef(null);
  const petScrollRef = useRef(null);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedToast, setAddedToast] = useState(null);
  const [selectedPet, setSelectedPet] = useState('cat');

  const scrollCategory = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollPet = (direction) => {
    if (petScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      petScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
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
          DECORATIVE ORGANIC PINK BLOBS (Matching Main Page Mockup)
      ───────────────────────────────────────────────────────────── */}
      {/* Far Right Edge Semi-Circle Blob */}
      <div
        className="pointer-events-none absolute top-[70px] -right-12 sm:-right-10 w-20 h-44 sm:w-24 sm:h-56 rounded-l-full bg-[#E050D0] opacity-90 blur-[0.5px] z-0"
        aria-hidden="true"
      />

      {/* Top Center Floating Accent Blob */}
      <div
        className="pointer-events-none absolute top-10 left-[26%] w-16 h-12 sm:w-20 sm:h-14 rounded-[45%_55%_65%_35%] bg-[#E050D0] opacity-85 z-0"
        aria-hidden="true"
      />

      {/* Bottom Floating Accent Blob below Hero CTA */}
      <div
        className="pointer-events-none absolute top-[430px] left-[32%] w-16 h-12 sm:w-20 sm:h-14 rounded-[50%_60%_40%_50%] bg-[#E050D0] opacity-85 z-0"
        aria-hidden="true"
      />

      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Matching Main Page Mockup in Pink Theme)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-4 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col items-start pt-4 sm:pt-8">
              <span className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#E050D0] mb-3 inline-block">
                Pet Shop
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-tight text-gray-900 leading-[1.12] mb-5">
                A pet store with everything you need
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed max-w-xl mb-8">
                Sociis blandit et pellentesque aliquet at quisque tortor lacinia nullam. Mattis aenean scelerisque dui libero.
              </p>

              <div>
                <button
                  onClick={() => navigate('/products')}
                  className="inline-flex items-center justify-center font-bold text-sm sm:text-base bg-black hover:bg-neutral-800 text-white px-9 py-3.5 rounded-full transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg cursor-pointer"
                >
                  Shop Now
                </button>
              </div>
            </div>

            {/* Right Graphic: Organic Pink Blob with Real Pet Store Photography */}
            <div className="lg:col-span-6 flex items-center justify-center relative">
              <div className="relative w-full max-w-[480px] aspect-[4/3] sm:aspect-square flex items-center justify-center">
                {/* Soft Pink Organic Glow & Shape */}
                <div className="absolute inset-0 bg-[#E050D0] rounded-[48%_52%_60%_40%/45%_55%_45%_55%] transform -rotate-2 transition-transform duration-700 hover:rotate-0" />
                {/* Real Pet Store Hero Photo */}
                <div className="relative z-10 w-[90%] h-[90%] rounded-[46%_54%_58%_42%/48%_52%_48%_52%] overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="/assets/asset-058339ca.jpeg"
                    alt="Poonch Pet Store - Everything for your pets"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. BROWSE BY CATEGORY (Matching Mockup with Black Arrows)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Section Header with Carousel Arrows */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-gray-900">
            Browse by category
          </h2>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => scrollCategory('left')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 active:scale-95 transition-all shadow-sm cursor-pointer"
              aria-label="Previous categories"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => scrollCategory('right')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 active:scale-95 transition-all shadow-sm cursor-pointer"
              aria-label="Next categories"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Categories Grid / Carousel */}
        <div
          ref={categoryScrollRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {CATEGORIES_DATA.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(cat.link)}
              className="bg-white rounded-3xl p-3 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(224,80,208,0.15)] hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer flex flex-col"
            >
              {/* Category Image */}
              <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 relative mb-3.5">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Title & Count */}
              <div className="flex items-center justify-between px-2 pt-1 pb-1">
                <div>
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-[#E050D0] transition-colors leading-snug">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {cat.count}
                  </p>
                </div>

                <div className="w-7 h-7 rounded-full border border-gray-200 text-gray-400 flex items-center justify-center group-hover:border-[#E050D0] group-hover:bg-[#E050D0] group-hover:text-white transition-all shadow-sm shrink-0">
                  <ArrowRight size={13} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. FEATURED PRODUCTS (Matching Mockup with Real Product Photos)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-gray-900 text-center mb-10 sm:mb-14">
          Featured products
        </h2>

        {/* 3 Product Cards matching Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {FEATURED_PRODUCTS.map((prod) => {
            const wishlisted = isInWishlist(prod.id);
            return (
              <div
                key={prod.id}
                onClick={() => navigate('/products')}
                className="bg-[#F8F9FA] rounded-[28px] p-6 sm:p-7 border border-gray-100/90 relative group flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Product Photo */}
                <div className="py-6 sm:py-8 flex items-center justify-center h-48 sm:h-56">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                  />
                </div>

                {/* Footer Content: Title + Price on left, Pink Heart on right */}
                <div className="pt-4 flex items-end justify-between border-t border-gray-200/50 mt-2">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-[#E050D0] transition-colors leading-tight mb-1">
                      {prod.name}
                    </h3>
                    <p className="font-extrabold text-sm sm:text-base text-gray-900">
                      ${prod.price.toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(prod);
                    }}
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-110",
                      wishlisted
                        ? "bg-[#E050D0] text-white"
                        : "text-[#E050D0] hover:bg-[#E050D0]/10"
                    )}
                    aria-label="Save to wishlist"
                    title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart size={18} strokeWidth={2} fill={wishlisted ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Quick Add on Hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-3">
                  <button
                    onClick={(e) => handleQuickAdd(prod, e)}
                    className="w-full py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. THE SMARTER WAY TO SHOP (Pink Blob + Real Pet Photo)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Organic Pink Blob with Real Pet Photography */}
          <div className="lg:col-span-6 flex items-center justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-[460px] aspect-[4/3] sm:aspect-square flex items-center justify-center">
              {/* Soft Pink Organic Shape */}
              <div className="absolute inset-0 bg-[#E050D0] rounded-[55%_45%_38%_62%/48%_60%_40%_52%] transform rotate-3 transition-transform duration-700 hover:rotate-0" />
              {/* Real Pet Photo */}
              <div className="relative z-10 w-[90%] h-[90%] rounded-[50%_50%_45%_55%/52%_48%_52%_48%] overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="/assets/asset-bafedd16.jpeg"
                  alt="The smarter way to shop for your pet"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Copy & CTA */}
          <div className="lg:col-span-6 flex flex-col items-start order-1 lg:order-2">
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#E050D0] mb-3 inline-block">
              Pet Shop
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight text-gray-900 leading-[1.15] mb-5">
              The smarter way to shop for your pet
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed max-w-xl mb-8">
              Sociis blandit et pellentesque aliquet at quisque tortor lacinia nullam. Mattis aenean scelerisque dui libero ac cursus viverra libero.
            </p>

            <div>
              <button
                onClick={() => navigate('/about')}
                className="inline-flex items-center justify-center font-bold text-sm sm:text-base bg-black hover:bg-neutral-800 text-white px-9 py-3.5 rounded-full transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg cursor-pointer"
              >
                Learn More
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. BRAND PARTNERS ROW (5 Icons in Pink Theme)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-4">
        <BrandPartners />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. BEST SELLING PRODUCTS (8 Real Product Photos Grid)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-gray-900 text-center mb-10 sm:mb-14">
          Best selling products
        </h2>

        {/* 8 Product Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {BEST_SELLING_PRODUCTS.map((prod) => {
            const wishlisted = isInWishlist(prod.id);
            return (
              <div
                key={prod.id}
                onClick={() => navigate('/products')}
                className="bg-[#F8F9FA] rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 border border-gray-100/90 relative group flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Product Photo Center */}
                <div className="py-6 sm:py-8 flex items-center justify-center h-36 sm:h-44">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                  />
                </div>

                {/* Footer Content: Name, Price, Heart */}
                <div className="pt-4 flex items-end justify-between border-t border-gray-200/50">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#E050D0] transition-colors leading-tight mb-1">
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
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. SHOP BY PET (Circular Real Photo Avatars)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Header with Navigation Arrows */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-gray-900">
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

        {/* 6 Circular Pet Avatars Row */}
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
                  setSelectedPet(pet.id);
                  navigate(`/products?category=${pet.name}`);
                }}
                className="flex flex-col items-center gap-3 cursor-pointer group shrink-0 min-w-[90px] sm:min-w-[110px]"
              >
                {/* Circular Real Photo Avatar Container */}
                <div
                  className={cn(
                    "w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 transition-all duration-300 transform group-hover:scale-105 border-2",
                    isSelected
                      ? "border-[#E050D0] shadow-[0_8px_25px_rgba(224,80,208,0.35)] ring-4 ring-[#E050D0]/20"
                      : "border-transparent bg-gray-100 group-hover:border-gray-300"
                  )}
                >
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Pet Name */}
                <span
                  className={cn(
                    "text-xs sm:text-sm font-bold transition-colors",
                    isSelected ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"
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
          8. NEWS & BLOG (3 Real Lifestyle Cards)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-gray-900 text-center mb-10 sm:mb-14">
          News &amp; Blog
        </h2>

        {/* 3 Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => navigate('/about')}
              className="bg-white rounded-[28px] overflow-hidden border border-gray-100/90 shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer flex flex-col"
            >
              {/* Blog Image with News Pill Tag */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* News Tag in Top-Left */}
                <div className="absolute top-4 left-4 bg-black text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {post.tag}
                </div>
              </div>

              {/* Blog Body: Date & Title */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-2.5">
                    {post.date}
                  </p>
                  <h3 className="font-extrabold text-base sm:text-lg text-gray-900 group-hover:text-[#E050D0] transition-colors leading-snug">
                    {post.title}
                  </h3>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs font-bold text-[#E050D0]">
                  <span>Read Article</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

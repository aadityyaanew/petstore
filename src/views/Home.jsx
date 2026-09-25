'use client';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, ArrowRight, Star, Quote } from 'lucide-react';
import BrandPartners from '../components/BrandPartners';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { cn } from '@/lib/utils';

const CATEGORIES_DATA = [
  {
    id: 'gyms',
    title: 'Play Gyms & Stands',
    count: '42 products',
    image: '/assets/asset-4cbbe7b6.jpeg',
    link: '/products?category=Toys',
  },
  {
    id: 'swings',
    title: 'Swings & Ladders',
    count: '38 products',
    image: '/assets/asset-6ebb9cd6.jpeg',
    link: '/products?category=Toys',
  },
  {
    id: 'perches',
    title: 'Perches & Branches',
    count: '29 products',
    image: '/assets/asset-675fd014.jpeg',
    link: '/products?category=Furniture',
  },
  {
    id: 'foraging',
    title: 'Foraging & Toys',
    count: '54 products',
    image: '/assets/asset-bff48261.jpeg',
    link: '/products?category=Toys',
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

const BIRD_TYPES = [
  { id: 'parrot', name: 'Parrot', image: '/assets/birds/parrot.jpg' },
  { id: 'cockatiel', name: 'Cockatiel', image: '/assets/birds/cockatiel.jpg' },
  { id: 'budgie', name: 'Budgie', image: '/assets/birds/budgie.jpg' },
  { id: 'conure', name: 'Sun Conure', image: '/assets/birds/conure.jpg' },
  { id: 'lovebird', name: 'Lovebird', image: '/assets/birds/lovebird.jpg' },
  { id: 'canary', name: 'Canary', image: '/assets/birds/canary.jpg' },
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

const TESTIMONIALS_DATA = [
  {
    id: 1,
    quote: "My cockatiel loves the three-perch play stand! It’s sturdy, easy to clean, and keeps him entertained for hours outside his cage.",
    author: "Sarah M.",
    role: "Verified Cockatiel Parent",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
    rating: 5,
    tag: "Multi-Perch Activity Stand",
  },
  {
    id: 2,
    quote: "The hand-knitted woolen collar is adorable! So soft on my cat’s neck and looks amazing in photos.",
    author: "David L.",
    role: "Verified Cat Parent",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    rating: 5,
    tag: "Hand-Knitted Woolen Collar",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const categoryScrollRef = useRef(null);
  const birdScrollRef = useRef(null);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedToast, setAddedToast] = useState(null);
  const [selectedBird, setSelectedBird] = useState('parrot');

  const scrollCategory = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollBird = (direction) => {
    if (birdScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      birdScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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
          <span>🦜</span>
          <span>{addedToast}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Sage/Cream Background, Colorful Parrots, Small Pink Accents)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-4 sm:pt-6 pb-0 overflow-hidden w-full min-h-[460px] sm:min-h-[560px] lg:min-h-[640px] flex items-center bg-[#FAF8F5] border-b border-[#E8ECE5]/60">
        
        {/* Right Full-Bleed Sage & Cream Organic Arch (Desktop/Large Screens) */}
        <div className="hidden lg:block absolute top-0 right-0 w-[51%] xl:w-[49%] h-full pointer-events-none z-0 overflow-hidden">
          <svg
            viewBox="0 0 700 640"
            preserveAspectRatio="none"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Avian Feather Watermark */}
              <g id="heroBirdFeather">
                <path
                  d="M18 2 C14 8, 7 18, 7 28 C7 35, 12 41, 18 45 C24 41, 29 35, 29 28 C29 18, 22 8, 18 2 Z"
                  fill="white"
                  fillOpacity="0.25"
                />
                <path
                  d="M18 2 L18 47"
                  stroke="white"
                  strokeOpacity="0.35"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M18 14 C13 17, 10 21, 9 26 M18 22 C13 25, 11 29, 10 34 M18 14 C23 17, 26 21, 27 26 M18 22 C23 25, 25 29, 26 34"
                  stroke="white"
                  strokeOpacity="0.22"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                />
              </g>

              {/* Avian Flying Silhouette Watermark */}
              <g id="heroFlyingSilhouette">
                <path
                  d="M20 18 C14 10, 6 7, 0 8 C6 13, 10 18, 14 23 C10 24, 4 24, 1 23 C5 26, 11 29, 17 28 C18 31, 19 36, 20 40 C21 36, 22 31, 23 28 C29 29, 35 26, 39 23 C36 24, 30 24, 26 23 C30 18, 34 13, 40 8 C34 7, 26 10, 20 18 Z"
                  fill="white"
                  fillOpacity="0.25"
                />
              </g>
            </defs>

            {/* Main Outer Sage Arch */}
            <path
              d="M70 640 C25 500 0 380 0 300 C0 180 50 80 180 30 C260 5 380 -5 520 0 L700 0 L700 640 Z"
              fill="#8BA88E"
            />

            {/* Inner Concentric Wave 1: Soft Pale Sage */}
            <path
              d="M180 640 C130 520 100 400 110 330 C120 230 160 140 260 85 C330 45 430 25 550 25 L700 25 L700 640 Z"
              fill="#C2D6C4"
              fillOpacity="0.9"
            />

            {/* Inner Concentric Wave 2: Warm Cream */}
            <path
              d="M290 640 C240 530 220 420 240 360 C260 280 290 200 370 145 C440 100 510 75 610 75 L700 75 L700 640 Z"
              fill="#F6F3EB"
              fillOpacity="0.95"
            />

            {/* Small Pink Accents nestled behind the parrots */}
            <ellipse cx="480" cy="370" rx="160" ry="170" fill="#E050D0" fillOpacity="0.78" />
            <circle cx="560" cy="270" r="85" fill="#F386E8" fillOpacity="0.68" />
            <circle cx="360" cy="430" r="48" fill="#EB68DC" fillOpacity="0.58" />

            {/* Scattered Avian Watermarks on Sage Layer */}
            <use href="#heroBirdFeather" x="130" y="460" transform="rotate(-25 130 460) scale(1.4)" />
            <use href="#heroFlyingSilhouette" x="90" y="270" transform="rotate(15 90 270) scale(1.1)" />
            <use href="#heroBirdFeather" x="420" y="50" transform="rotate(30 420 50) scale(1.3)" />
            <use href="#heroFlyingSilhouette" x="460" y="210" transform="rotate(-12 460 210) scale(1.2)" />
            <use href="#heroBirdFeather" x="540" y="390" transform="rotate(20 540 390) scale(1.3)" />
          </svg>
        </div>

        {/* Real Birds High-Definition Cutout anchored flush at bottom (Desktop/Large Screens) */}
        <div className="hidden lg:flex absolute bottom-0 right-0 sm:right-[1%] lg:right-[3%] xl:right-[5%] z-10 w-[53%] xl:w-[48%] max-w-[640px] pointer-events-none select-none items-end justify-center">
          <img
            src="/assets/hero-birds-group.png"
            alt="Handcrafted avian perches with Cockatiel, Budgie, Sun Conure, and Lovebird"
            className="w-full h-auto object-contain block drop-shadow-sm transform hover:scale-[1.01] transition-transform duration-500"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full h-full">
          
          {/* Top Center Floating Pink Pebble Blob (Desktop only) */}
          <div
            className="hidden lg:block pointer-events-none absolute -top-4 sm:top-0 left-[22%] sm:left-[26%] w-20 h-24 sm:w-26 sm:h-30 z-0 select-none opacity-90"
            aria-hidden="true"
          >
            <svg viewBox="0 0 110 130" fill="none" className="w-full h-full">
              <path
                d="M38 12C68 2 96 16 104 50C112 84 94 118 64 126C34 134 12 112 5 80C-2 48 8 22 38 12Z"
                fill="#E050D0"
              />
            </svg>
          </div>

          {/* Bottom Center Floating Sage Pebble Blob (Desktop only) */}
          <div
            className="hidden lg:block pointer-events-none absolute -bottom-6 left-[25%] sm:left-[28%] w-26 h-18 sm:w-32 sm:h-22 z-0 select-none opacity-90"
            aria-hidden="true"
          >
            <svg viewBox="0 0 130 85" fill="none" className="w-full h-full">
              <path
                d="M28 60C10 46 14 18 50 8C86 -2 116 15 126 45C136 74 110 84 74 84C38 84 42 72 28 60Z"
                fill="#8BA88E"
              />
            </svg>
          </div>

          {/* Flying Macaw / Parrot (Cutout PNG - Desktop) */}
          <div
            className="hidden lg:block pointer-events-none absolute top-8 sm:top-12 lg:top-14 left-[43%] sm:left-[45%] lg:left-[47%] w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 z-20 select-none drop-shadow-sm transform -rotate-12 hover:scale-105 transition-transform duration-300"
            aria-hidden="true"
          >
            <img
              src="/assets/flying-parrot.png"
              alt="Flying Macaw"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 flex flex-col items-start pt-6 sm:pt-10 pb-4 lg:pb-20 relative z-10">
              <span className="font-bold text-[11px] xs:text-xs sm:text-sm uppercase tracking-wider text-[#E050D0] bg-[#E050D0]/10 border border-[#E050D0]/20 px-3 xs:px-3.5 py-1 rounded-full mb-3 inline-block">
                Bird Shop &amp; Toys
              </span>

              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-tight text-gray-900 leading-[1.15] mb-3.5 sm:mb-5">
                A bird store with everything they need
              </h1>

              <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed max-w-lg mb-6 sm:mb-8">
                Handcrafted natural pine stands, chewable play gyms, and safe perches designed for parrots, cockatiels, budgies, and feathered friends.
              </p>

              <div>
                <button
                  onClick={() => navigate('/products')}
                  className="inline-flex items-center justify-center font-bold text-xs xs:text-sm sm:text-base bg-black hover:bg-neutral-800 text-white px-7 xs:px-9 py-3 sm:py-3.5 rounded-full transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg cursor-pointer"
                >
                  Shop Now
                </button>
              </div>
            </div>

            {/* Mobile Hero Visual Showcase (< lg) */}
            <div className="block lg:hidden w-full pb-8 pt-2 relative z-10">
              <div className="relative w-full aspect-[16/11] max-w-[460px] mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-[#E2ECE3] via-[#FAF8F5] to-[#F5ECE8] border border-[#8BA88E]/25 shadow-md flex items-end justify-center">
                {/* Organic soft sage & pink background shapes */}
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#8BA88E]/30 blur-xl pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-32 h-32 rounded-full bg-[#E050D0]/20 blur-xl pointer-events-none" />
                
                {/* Flying parrot accent */}
                <div className="absolute top-3 left-4 w-14 h-14 -rotate-12 z-20 pointer-events-none drop-shadow-sm">
                  <img src="/assets/flying-parrot.png" alt="Flying bird" className="w-full h-full object-contain" />
                </div>
                
                {/* Real Birds Cutout on Branch */}
                <img
                  src="/assets/hero-birds-group.png"
                  alt="Handcrafted avian perches with Cockatiel, Budgie, Sun Conure, and Lovebird"
                  className="w-[96%] h-auto object-contain relative z-10 drop-shadow-md"
                />
              </div>
            </div>

            {/* Right Column: Spacer for Desktop Grid Balance */}
            <div className="hidden lg:block lg:col-span-6 pointer-events-none" aria-hidden="true" />

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

        {/* Categories Grid */}
        <div
          ref={categoryScrollRef}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6"
        >
          {CATEGORIES_DATA.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(cat.link)}
              className="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(224,80,208,0.15)] hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer flex flex-col"
            >
              {/* Category Image */}
              <div className="rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 relative mb-2.5 sm:mb-3.5">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Title & Count */}
              <div className="flex items-center justify-between px-1.5 sm:px-2 pt-0.5 pb-1">
                <div>
                  <h3 className="font-bold text-xs xs:text-sm sm:text-base text-gray-900 group-hover:text-[#E050D0] transition-colors leading-snug line-clamp-1 sm:line-clamp-none">
                    {cat.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium mt-0.5">
                    {cat.count}
                  </p>
                </div>

                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-gray-200 text-gray-400 flex items-center justify-center group-hover:border-[#E050D0] group-hover:bg-[#E050D0] group-hover:text-white transition-all shadow-sm shrink-0">
                  <ArrowRight size={12} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. FEATURED PRODUCTS (Matching Mockup with Real Product Photos)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-gray-900 text-center mb-8 sm:mb-14">
          Featured products
        </h2>

        {/* 3 Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
          {FEATURED_PRODUCTS.map((prod) => {
            const wishlisted = isInWishlist(prod.id);
            return (
              <div
                key={prod.id}
                onClick={() => navigate('/products')}
                className="bg-[#F8F9FA] rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 border border-gray-100/90 relative group flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Product Photo */}
                <div className="py-4 sm:py-8 flex items-center justify-center h-44 sm:h-56">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                  />
                </div>

                {/* Footer Content: Title + Price on left, Pink Heart on right */}
                <div className="pt-3 sm:pt-4 flex items-end justify-between border-t border-gray-200/50 mt-2">
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
                      "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-110 shrink-0",
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

                {/* Quick Add (Visible on Mobile Touch, Hover on Desktop) */}
                <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 mt-3">
                  <button
                    onClick={(e) => handleQuickAdd(prod, e)}
                    className="w-full py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
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
          4. THE SMARTER WAY TO CARE (Pink Blob + Child & Birds on Wooden Gym)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Organic Pink Blob with Real Bird Toy Lifestyle Photography */}
          <div className="lg:col-span-6 flex items-center justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-[360px] sm:max-w-[460px] aspect-[4/3] sm:aspect-square flex items-center justify-center">
              {/* Soft Pink Organic Shape */}
              <div className="absolute inset-0 bg-[#E050D0] rounded-[55%_45%_38%_62%/48%_60%_40%_52%] transform rotate-3 transition-transform duration-700 hover:rotate-0" />
              {/* Real Bird Lifestyle Photo */}
              <div className="relative z-10 w-[90%] h-[90%] rounded-[50%_50%_45%_55%/52%_48%_52%_48%] overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="/assets/asset-b8e1a86b.jpeg"
                  alt="Pet birds playing on handcrafted wooden gym stand"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Copy & CTA */}
          <div className="lg:col-span-6 flex flex-col items-start order-1 lg:order-2">
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#E050D0] mb-2 sm:mb-3 inline-block">
              Avian Enrichment
            </span>

            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight text-gray-900 leading-[1.15] mb-3 sm:mb-5">
              The smarter way to care for your bird
            </h2>

            <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed max-w-xl mb-6 sm:mb-8">
              Handmade non-toxic pine play gyms, swings, and foraging puzzles crafted to encourage natural climbing, foraging, and active exercise for birds of all sizes.
            </p>

            <div>
              <button
                onClick={() => navigate('/about')}
                className="inline-flex items-center justify-center font-bold text-xs xs:text-sm sm:text-base bg-black hover:bg-neutral-800 text-white px-7 xs:px-9 py-3 sm:py-3.5 rounded-full transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg cursor-pointer"
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
      <section className="relative z-10 py-2 sm:py-4">
        <BrandPartners />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. BEST SELLING PRODUCTS (8 Real Product Photos Grid)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-gray-900 text-center mb-8 sm:mb-14">
          Best selling products
        </h2>

        {/* 8 Product Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {BEST_SELLING_PRODUCTS.map((prod) => {
            const wishlisted = isInWishlist(prod.id);
            return (
              <div
                key={prod.id}
                onClick={() => navigate('/products')}
                className="bg-[#F8F9FA] rounded-[20px] sm:rounded-[28px] p-3 xs:p-4 sm:p-6 border border-gray-100/90 relative group flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Product Photo Center */}
                <div className="py-2 sm:py-6 flex items-center justify-center h-28 xs:h-36 sm:h-44">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                  />
                </div>

                {/* Footer Content: Name, Price, Heart */}
                <div className="pt-2 sm:pt-4 flex items-end justify-between border-t border-gray-200/50">
                  <div className="pr-1">
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#E050D0] transition-colors leading-tight mb-0.5 sm:mb-1 line-clamp-1">
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
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. SHOP BY BIRD (Circular Real Avian Photo Avatars)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Header with Navigation Arrows */}
        <div className="flex items-center justify-between mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-gray-900">
            Shop by bird
          </h2>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => scrollBird('left')}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 active:scale-95 transition-all shadow-sm cursor-pointer"
              aria-label="Previous birds"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => scrollBird('right')}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 active:scale-95 transition-all shadow-sm cursor-pointer"
              aria-label="Next birds"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* 6 Circular Bird Avatars Row */}
        <div
          ref={birdScrollRef}
          className="flex items-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-3 px-1 snap-x touch-scroll"
        >
          {BIRD_TYPES.map((bird) => {
            const isSelected = selectedBird === bird.id;
            return (
              <div
                key={bird.id}
                onClick={() => {
                  setSelectedBird(bird.id);
                  navigate(`/products?category=${bird.name}`);
                }}
                className="flex flex-col items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 min-w-[80px] xs:min-w-[95px] sm:min-w-[110px] snap-center"
              >
                {/* Circular Real Photo Avatar Container */}
                <div
                  className={cn(
                    "w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 transition-all duration-300 transform group-hover:scale-105 border-2",
                    isSelected
                      ? "border-[#E050D0] shadow-[0_8px_25px_rgba(224,80,208,0.35)] ring-4 ring-[#E050D0]/20"
                      : "border-transparent bg-gray-100 group-hover:border-gray-300"
                  )}
                >
                  <img
                    src={bird.image}
                    alt={bird.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Bird Name */}
                <span
                  className={cn(
                    "text-xs sm:text-sm font-bold transition-colors",
                    isSelected ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"
                  )}
                >
                  {bird.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7.5. TESTIMONIALS (Customer Reviews)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E050D0]/10 text-[#E050D0] mb-3">
            Real Customer Stories
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-gray-900">
            Loved by Pets, Cherished by Humans
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            "Safe Play, Happy Tails &amp; Feathered Friends." — See how our non-toxic accessories bring joy every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {TESTIMONIALS_DATA.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[28px] p-7 sm:p-9 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                    {item.tag}
                  </span>
                </div>

                <p className="text-base sm:text-lg text-gray-800 font-medium leading-relaxed mb-6 italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-5 border-t border-gray-100">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#E050D0]/20"
                />
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm sm:text-base">
                    {item.author}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
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

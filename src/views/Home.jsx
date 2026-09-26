'use client';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, ArrowRight, Star, Quote } from 'lucide-react';
import BrandPartners from '../components/BrandPartners';

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
    title: 'Top 5 Fun Foraging Toys to Keep Your Bird Entertained',
    image: '/assets/asset-bafedd16.jpeg',
  },
  {
    id: 2,
    tag: 'News',
    date: '24 May 2024',
    title: 'The Ultimate Guide to Choosing the Right Perch for Your Parrot',
    image: '/assets/asset-b7038046.jpeg',
  },
  {
    id: 3,
    tag: 'News',
    date: '24 May 2024',
    title: "Why Wood Toys Are Essential for Your Feathered Friend's Health",
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

          <span>{addedToast}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Full Background Image)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex items-center bg-gray-900">
        {/* Full Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/herobackground.png"
            alt="Hero Background"
            className="w-full h-full object-cover object-right sm:object-center"
          />
          {/* Gradient overlay: dark on left for text readability, clear on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 lg:via-black/20 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full h-full flex items-center">
          <div className="max-w-2xl text-white">
            <span className="font-bold text-[11px] xs:text-xs sm:text-sm uppercase tracking-wider text-white bg-white/20 border border-white/30 px-3 xs:px-3.5 py-1 rounded-full mb-3 sm:mb-4 inline-block backdrop-blur-sm">
              Bird Shop &amp; Toys
            </span>

            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold tracking-tight leading-[1.1] mb-4 sm:mb-6">
              A bird store with everything they need
            </h1>

            <p className="text-sm xs:text-base sm:text-lg text-white/90 leading-relaxed max-w-xl mb-6 sm:mb-8 font-medium drop-shadow-md">
              Handcrafted natural pine stands, chewable play gyms, and safe perches designed for parrots, cockatiels, budgies, and feathered friends.
            </p>

            <div>
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center justify-center font-bold text-xs xs:text-sm sm:text-base bg-[#E050D0] hover:bg-[#c945ba] text-white px-8 xs:px-10 py-3.5 sm:py-4 rounded-full transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer"
              >
                Shop Now
              </button>
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
              onClick={() => navigate(`/blog/${post.id}`)}
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

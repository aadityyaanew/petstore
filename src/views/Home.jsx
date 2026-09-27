'use client';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, ArrowRight, Star, Quote, ShoppingCart, Bird, Leaf } from 'lucide-react';
import BrandPartners from '../components/BrandPartners';
import ProductCard from '../components/ProductCard';
import api, { BASE_URL } from '../services/api';
import { useCart } from '../context/CartContext';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bannersRes, blogsRes, categoriesRes, productsRes] = await Promise.all([
          api.getBanners(),
          api.getBlogs(),
          api.getCategories(),
          api.getProducts({ limit: 12 })
        ]);
        if (bannersRes.data && bannersRes.data.banners) {
          setBanners(bannersRes.data.banners);
        }
        if (blogsRes.data && blogsRes.data.blogs) {
          setBlogs(blogsRes.data.blogs.filter(b => b.isPublished).slice(0, 3));
        }
        if (categoriesRes.data && categoriesRes.data.categories) {
          setCategories(categoriesRes.data.categories.filter(c => c.isActive));
        }
        if (productsRes.data && productsRes.data.products) {
          const prods = productsRes.data.products;
          setFeaturedProducts(prods.slice(0, 3));
          setBestSellingProducts(prods.slice(3, 11));
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

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
          1. HERO SECTION (Ultra-Premium Carousel)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center bg-[#0F172A] overflow-hidden">
        {banners.length > 0 ? (
          banners.map((banner, index) => (
            <div 
              key={banner._id || index}
              className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${index === currentBanner ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'}`}
            >
              {/* Background Image & Multi-layer Overlay */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={banner.image?.startsWith('http') ? banner.image : `${BASE_URL}${banner.image}`} 
                  alt={banner.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/70 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0F172A]/80"></div>
              </div>

              {/* Foreground Content */}
              <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10 w-full h-full flex items-center">
                <div className="max-w-2xl text-white transform transition-all duration-[1200ms] delay-300">
                  {banner.subtitle && (
                    <div className="flex items-center gap-3 mb-5">
                      <span className="w-10 h-[2px] bg-[#E050D0]"></span>
                      <span className="font-extrabold text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#E050D0]">
                        {banner.subtitle}
                      </span>
                    </div>
                  )}
                  
                  <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[84px] font-extrabold tracking-tight leading-[1.05] mb-6 drop-shadow-sm font-display">
                    {banner.title.split(' ').map((word, i, arr) => (
                      <span key={i} className={i === arr.length - 1 ? "text-[#E050D0]" : ""}>{word} </span>
                    ))}
                  </h1>
                  
                  <p className="text-sm sm:text-lg text-white/80 leading-relaxed max-w-lg mb-8 font-medium border-l-2 border-white/20 pl-4">
                    Handcrafted natural pine stands, chewable play gyms, and safe perches designed for parrots, cockatiels, budgies, and feathered friends.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => navigate(banner.buttonLink || '/products')}
                      className="inline-flex items-center justify-center font-extrabold text-sm bg-white hover:bg-gray-100 text-gray-900 px-10 py-4 rounded-full transition-all duration-300 active:scale-95 shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_40px_rgb(224,80,208,0.3)] cursor-pointer group"
                    >
                      {banner.buttonText || 'Shop Collection'}
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1.5 transition-transform" />
                    </button>
                    <button
                      onClick={() => {
                        const target = document.getElementById('featured-products');
                        if(target) target.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center justify-center font-extrabold text-sm text-white px-8 py-4 rounded-full transition-all duration-300 hover:bg-white/10 active:scale-95 cursor-pointer backdrop-blur-sm"
                    >
                      View Best Sellers
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Fallback Original Hero */
          <div className="absolute inset-0 z-10 scale-100">
            <div className="absolute inset-0 z-0">
              <img
                src="/assets/herobackground.png"
                alt="Hero Background"
                className="w-full h-full object-cover object-right sm:object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/70 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0F172A]/80"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10 w-full h-full flex items-center">
              <div className="max-w-2xl text-white">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-10 h-[2px] bg-[#E050D0]"></span>
                  <span className="font-extrabold text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#E050D0]">
                    Bird Shop &amp; Toys
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[84px] font-extrabold tracking-tight leading-[1.05] mb-6 drop-shadow-sm font-display">
                  Everything they <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E050D0] to-[#FBA8FA]">need.</span>
                </h1>

                <p className="text-sm sm:text-lg text-white/80 leading-relaxed max-w-lg mb-8 font-medium border-l-2 border-white/20 pl-4">
                  Handcrafted natural pine stands, chewable play gyms, and safe perches designed for parrots, cockatiels, budgies, and feathered friends.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => navigate('/products')}
                    className="inline-flex items-center justify-center font-extrabold text-sm bg-white hover:bg-gray-100 text-gray-900 px-10 py-4 rounded-full transition-all duration-300 active:scale-95 shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_40px_rgb(224,80,208,0.3)] cursor-pointer group"
                  >
                    Shop Collection
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation Dots if multiple banners */}
        {banners.length > 1 && (
          <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-3">
            {banners.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentBanner(idx)}
                className={`w-12 h-1.5 rounded-full transition-all duration-500 overflow-hidden bg-white/30`}
              >
                <div 
                  className="h-full bg-[#E050D0] transition-all duration-[5000ms] ease-linear"
                  style={{ width: idx === currentBanner ? '100%' : '0%' }}
                />
              </button>
            ))}
          </div>
        )}
      </section>




      {/* ─────────────────────────────────────────────────────────────
          2. CATEGORIES SECTION
      ───────────────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 bg-white">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-gray-900">
              Shop by Category
            </h2>
            <button onClick={() => navigate('/products')} className="text-sm font-bold text-[#E050D0] hover:text-gray-900 transition-colors flex items-center gap-1">
              View All <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <div 
                key={cat._id}
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                className="group cursor-pointer flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 mb-4 border-4 border-transparent group-hover:border-[#E050D0]/20 transition-all duration-300 group-hover:shadow-lg relative">
                  <img 
                    src={cat.image || '/assets/placeholder-category.png'} 
                    alt={cat.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900 group-hover:text-[#E050D0] transition-colors">
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>
        </section>
      )}


      {/* ─────────────────────────────────────────────────────────────
          3. FEATURED PRODUCTS (Using Real ProductCard)
      ───────────────────────────────────────────────────────────── */}
      <section id="featured-products" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-gray-900 text-center mb-8 sm:mb-14">
          Featured products
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-card rounded-lg p-3 sm:p-5 border shadow-sm relative flex flex-col justify-between">
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod._id || prod.id} product={prod} onToast={setAddedToast} />
            ))}
          </div>
        )}
      </section>



      {/* ─────────────────────────────────────────────────────────────
          5. BRAND PARTNERS ROW (5 Icons in Pink Theme)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-2 sm:py-4">
        <BrandPartners />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. BEST SELLING PRODUCTS (Real Product Cards)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-gray-900 text-center mb-8 sm:mb-14">
          Best selling products
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="bg-card rounded-lg p-3 sm:p-5 border shadow-sm relative flex flex-col justify-between">
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
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {bestSellingProducts.map((prod) => (
              <ProductCard key={prod._id || prod.id} product={prod} onToast={setAddedToast} />
            ))}
          </div>
        )}
      </section>



      {/* ─────────────────────────────────────────────────────────────
          7.5. TESTIMONIALS (Customer Reviews) - DISABLED (DEMO DATA)
      ───────────────────────────────────────────────────────────── */}
      {/* 
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
      */}

      {/* ─────────────────────────────────────────────────────────────
          8. NEWS & BLOG (3 Real Lifestyle Cards)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-gray-900 text-center mb-10 sm:mb-14">
          News &amp; Blog
        </h2>

        {/* 3 Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {blogs.map((post) => (
            <div
              key={post._id}
              onClick={() => navigate(`/blog/${post._id}`)}
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

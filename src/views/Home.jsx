import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Leaf, ShieldCheck, Truck, RefreshCcw, Quote } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { cn } from '@/lib/utils';
import api, { BASE_URL } from '../services/api';

const FALLBACK_BANNERS = [
  {
    title: 'Keep Your Birds Active & Healthy!',
    subtitle: 'Explore our 100% natural wood playstands and training gyms. Crafted for curious, active birds who deserve the best.',
    buttonText: 'Shop Bird Toys',
    buttonLink: '/products?category=birds',
    emoji: '🦜',
    accent: '#E91E8C',
  },
  {
    title: 'Hand-Knitted Comfort for Your Feline Friend',
    subtitle: "Festive and cozy woolen cat collars crafted by expert artisans. Soft on your cat's neck and adorable in every photo.",
    buttonText: 'Shop Cat Collars',
    buttonLink: '/products?category=cats',
    emoji: '🐱',
    accent: '#FF4DB8',
  },
  {
    title: 'Safe, Non-Toxic & Built for Play',
    subtitle: 'All our products are free from artificial dyes and harsh chemicals. Because your pet\'s safety is our top priority.',
    buttonText: 'Explore All Products',
    buttonLink: '/products',
    emoji: '🐾',
    accent: '#E91E8C',
  },
];

const TRUST_BADGES = [
  { icon: Leaf, label: '100% Natural Wood', desc: 'No dyes or glues', color: 'text-emerald-500' },
  { icon: ShieldCheck, label: 'Non-Toxic & Safe', desc: 'Certified for all pets', color: 'text-brand-pink' },
  { icon: Truck, label: 'Fast Shipping', desc: '1–3 day processing', color: 'text-blue-500' },
  { icon: RefreshCcw, label: '30-Day Returns', desc: 'Hassle-free guarantee', color: 'text-amber-500' },
];

const CATEGORIES = [
  { title: 'Bird Accessories & Toys', subtitle: 'Activity stands, swings, foraging games', emoji: '🦜', link: '/products?category=birds' },
  { title: 'Cat Accessories', subtitle: 'Hand-knitted collars, festive costumes', emoji: '🐱', link: '/products?category=cats' },
  { title: 'Dog & Small Animals', subtitle: 'Leashes, collars, interactive equipment', emoji: '🐶', link: '/products?category=dogs' },
];

const TESTIMONIALS = [
  { quote: "My cockatiel loves the three-perch play stand! It's sturdy, easy to clean, and keeps him entertained for hours outside his cage.", author: 'Sarah M.', product: 'Bird Play Stand', initial: 'S' },
  { quote: "The hand-knitted woolen collar is adorable! So soft on my cat's neck and looks amazing in photos. Highly recommend!", author: 'David L.', product: 'Woolen Cat Collar', initial: 'D' },
  { quote: "Great quality products and fast shipping. My parrot loves the foraging toys — keeps him busy all day!", author: 'Priya K.', product: 'Foraging Toy Set', initial: 'P' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, bannerRes] = await Promise.allSettled([api.getProducts(), api.getBanners()]);
        if (prodRes.status === 'fulfilled') setProducts(prodRes.value.data.products || []);
        if (bannerRes.status === 'fulfilled' && bannerRes.value.data.success) setBanners(bannerRes.value.data.banners || []);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const displayBanners = banners.length > 0 ? banners : FALLBACK_BANNERS;

  useEffect(() => {
    if (displayBanners.length <= 1) return;
    const t = setInterval(() => setSlide((p) => (p + 1) % displayBanners.length), 5500);
    return () => clearInterval(t);
  }, [displayBanners.length]);

  const active = displayBanners[slide];

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-brand-charcoal text-white min-h-[420px] md:min-h-[500px] flex items-center mx-0 md:mx-4 md:rounded-3xl mb-10">
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-brand-pink/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-brand-pink/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="flex items-center justify-between gap-8">
            <div className="max-w-2xl">
              <Badge variant="pink" className="mb-4 animate-fade-in">🐾 New Collection</Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4 transition-all duration-500">
                {active?.title || 'Safe Play, Happy Tails 🐾'}
              </h1>
              {active?.subtitle && (
                <p className="text-lg text-white/80 leading-relaxed max-w-lg mb-8">
                  {active.subtitle}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="lg" onClick={() => navigate(active?.buttonLink || '/products')}>
                  {active?.buttonText || 'Shop Now'} →
                </Button>
                <Button
                  size="lg"
                  onClick={() => navigate('/about')}
                  className="border-2 border-white/30 bg-transparent hover:bg-white/10 text-white hover:shadow-none"
                >
                  Our Story
                </Button>
              </div>
            </div>

            {active?.emoji && (
              <div className="hidden lg:flex text-[8rem] leading-none drop-shadow-[0_0_40px_rgba(233,30,140,0.5)] select-none shrink-0">
                {active.emoji}
              </div>
            )}
          </div>
        </div>

        {/* Dots */}
        {displayBanners.length > 1 && (
          <>
            <button
              onClick={() => setSlide((s) => (s === 0 ? displayBanners.length - 1 : s - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-brand-pink/50 flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setSlide((s) => (s + 1) % displayBanners.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-brand-pink/50 flex items-center justify-center transition-colors"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
              {displayBanners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === slide ? "w-6 bg-brand-pink" : "w-2 bg-white/30"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TRUST_BADGES.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-border hover:border-brand-pink/25 hover:shadow-[0_4px_20px_rgba(233,30,140,0.08)] transition-all duration-200">
                <Icon size={26} className={cn("shrink-0", b.color)} />
                <div>
                  <p className="text-sm font-bold text-foreground leading-tight">{b.label}</p>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="mb-7">
          <h2 className="section-heading">Shop by Category</h2>
          <p className="section-subheading">Curated accessories for every beloved companion</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, i) => (
            <button
              key={i}
              onClick={() => navigate(cat.link)}
              className="text-left p-6 rounded-2xl border border-brand-pink/15 bg-gradient-to-br from-brand-pink/5 to-transparent hover:border-brand-pink/40 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(233,30,140,0.12)] transition-all duration-300 group"
            >
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300 block">
                {cat.emoji}
              </div>
              <h3 className="font-bold text-lg text-foreground mb-1">{cat.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{cat.subtitle}</p>
              <Badge variant="secondary" className="text-xs">Explore →</Badge>
            </button>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="section-heading">Featured Products</h2>
            <p className="section-subheading">Handpicked for your happy pets 🐾</p>
          </div>
          <Button variant="outline-pink" size="sm" onClick={() => navigate('/products')} className="hidden sm:flex">
            View All →
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-brand-pink/20 border-t-brand-pink animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🐾</div>
            <p className="text-xl font-bold text-foreground mb-1">Products Coming Soon!</p>
            <p className="text-muted-foreground">Our artisans are crafting something beautiful for your pets.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {products.slice(0, 8).map((p) => (
              <ProductCard
                key={p._id}
                product={{ id: p._id, title: p.name, price: p.price, category: p.category, image: p.images?.[0] || '', stock: p.stock }}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-6 sm:hidden">
          <Button variant="outline-pink" onClick={() => navigate('/products')}>
            View All Products →
          </Button>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-brand-charcoal py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Happy Pet Owners ❤️</h2>
            <p className="text-white/60">Real stories from our community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/5 border border-brand-pink/15 hover:bg-white/8 hover:border-brand-pink/40 hover:-translate-y-1 transition-all duration-300"
              >
                <Quote size={32} className="text-brand-pink mb-3 opacity-70" />
                <p className="text-white/85 text-sm leading-relaxed italic mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-pink flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{t.author}</p>
                    <p className="text-white/50 text-xs">{t.product}</p>
                  </div>
                  <div className="ml-auto text-amber-400 text-sm">★★★★★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

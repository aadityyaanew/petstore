import { Truck, Zap, Globe, Package } from 'lucide-react';

const PLANS = [
  { icon: Truck, iconColor: 'text-blue-500 bg-blue-50', title: 'Standard Shipping', desc: 'Processing: 1–3 business days. Delivery: 3–7 business days depending on your destination.', price: 'Calculated at Checkout', note: 'Free on orders over $50', featured: false },
  { icon: Zap, iconColor: 'text-brand-pink bg-brand-pink/10', title: 'Express Shipping', desc: 'Priority processing within 1 business day. Delivery in 2–3 business days. Order by 2 PM for same-day dispatch.', price: '$9.99', note: 'Flat rate, nationwide', featured: true },
  { icon: Globe, iconColor: 'text-emerald-500 bg-emerald-50', title: 'International', desc: 'Delivery times vary by destination (typically 7–14 business days). Customs fees may apply.', price: 'Calculated at Checkout', note: 'Based on destination', featured: false },
];

const POLICIES = [
  { emoji: '⏱️', title: 'Processing Time', desc: 'All orders are processed within 1–3 business days after payment confirmation.' },
  { emoji: '📬', title: 'Tracking Updates', desc: 'Tracking links are provided via email upon dispatch. Allow 24 hours for updates.' },
  { emoji: '📋', title: 'Care Instructions', desc: 'Every shipped package includes a Care Instructions Card for wood and knitted products.' },
];

const Shipping = () => {
  return (
    <div>
      <div className="relative bg-brand-charcoal text-white py-12 sm:py-16 md:py-20 overflow-hidden mb-8 sm:mb-12">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-brand-pink/20 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <span className="pink-badge mb-3 sm:mb-4 inline-block text-xs">Fast & Reliable</span>
          <h1 className="text-2xl xs:text-3xl md:text-5xl font-extrabold mb-2.5 sm:mb-3">Shipping Information 📦</h1>
          <p className="text-sm sm:text-base md:text-lg text-white/75 max-w-xl mx-auto">Everything you need to know about shipping, processing, and delivery times.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 pb-16 sm:pb-20">
        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-12">
          {PLANS.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className={`relative bg-white rounded-2xl border p-5 sm:p-6 shadow-sm ${p.featured ? 'border-brand-pink shadow-[0_8px_32px_rgba(233,30,140,0.15)] sm:col-span-2 md:col-span-1' : 'border-border'}`}>
                {p.featured && (
                  <>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-brand-pink rounded-t-2xl" />
                    <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-brand-pink text-white px-2 py-0.5 rounded-full">Popular</span>
                  </>
                )}
                <div className={`inline-flex w-12 h-12 sm:w-14 sm:h-14 rounded-2xl items-center justify-center mb-3 sm:mb-4 ${p.iconColor}`}>
                  <Icon size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-foreground mb-1.5 sm:mb-2">{p.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:min-h-[56px] leading-relaxed">{p.desc}</p>
                <div className="border-t border-border pt-3.5 sm:pt-4">
                  <p className="text-xl sm:text-2xl font-extrabold text-brand-pink">{p.price}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.note}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Policy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {POLICIES.map((p, i) => (
            <div key={i} className="p-5 bg-white rounded-2xl border border-border text-center hover:border-brand-pink/25 hover:shadow-[0_4px_20px_rgba(233,30,140,0.08)] transition-all">
              <div className="text-4xl mb-3">{p.emoji}</div>
              <p className="font-bold text-foreground mb-1">{p.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Tracking Info */}
        <div className="p-6 md:p-8 rounded-2xl bg-brand-pink/5 border border-brand-pink/15">
          <div className="flex items-center gap-3 mb-3">
            <Package size={24} className="text-brand-pink" />
            <h3 className="font-bold text-lg text-foreground">Order Tracking</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Once your Poonch Pet Store order has been dispatched, you'll receive an email with your tracking number and carrier link. 
            Please allow up to <strong>24 hours</strong> for updates. If you haven't received tracking within 5 business days, contact us at{' '}
            <a href="mailto:support@poonchpetstore.com" className="text-brand-pink font-semibold hover:underline">support@poonchpetstore.com</a> or call{' '}
            <a href="tel:+18001234567" className="text-brand-pink font-semibold hover:underline">+1 (800) 123-4567</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Shipping;

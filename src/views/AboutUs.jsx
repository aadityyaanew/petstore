import { Leaf, ShieldCheck, Heart } from 'lucide-react';

const VALUES = [
  { icon: Leaf, color: 'text-emerald-500 bg-emerald-50', title: 'Natural Materials Only', desc: "We use 100% natural wood and non-toxic materials with zero artificial dyes or harsh chemicals. Your pet's safety is our highest priority." },
  { icon: ShieldCheck, color: 'text-brand-pink bg-brand-pink/8', title: 'Pet Health & Well-Being', desc: "Our products are thoughtfully designed to enrich your pet's physical health and mental stimulation — from brain games to activity stands." },
  { icon: Heart, color: 'text-blue-500 bg-blue-50', title: 'Crafted with Love', desc: "Each item — from artisan hand-knitted woolen collars to interactive bird stands — is made with care and passion for animals." },
];

const AboutUs = () => {
  return (
    <div>
      {/* Hero */}
      <div className="relative bg-brand-charcoal text-white py-20 md:py-28 overflow-hidden mb-14">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-brand-pink/20 blur-3xl" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <span className="pink-badge mb-4 inline-block">Who We Are</span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            About Poonch Pet Store 🦜
          </h1>
          <p className="text-xl text-white/75 max-w-2xl">
            "Safe Play, Happy Tails & Feathered Friends." — This isn't just our tagline. It's our promise.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center mb-20">
          <div className="flex justify-center">
            <img
              src="/logo.jpeg"
              alt="Poonch Pet Store"
              className="w-72 h-72 md:w-80 md:h-80 rounded-full object-cover shadow-[0_20px_60px_rgba(233,30,140,0.2)] border-4 border-brand-pink/20"
            />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-pink block mb-2">Our Story</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-5 text-foreground">
              Dedicated Pet Lovers, Through & Through
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Welcome to Poonch Pet Store! We are dedicated pet lovers committed to creating safe, engaging, and high-quality accessories for your beloved companions.</p>
              <p>From artisan hand-knitted woolen collars to interactive, natural-wood bird activity stands, our products are crafted to enrich your pet's physical health and mental well-being.</p>
              <p>We prioritize non-toxic materials, durable designs, and thoughtful details so your pets can play, exercise, and lounge safely — every single day.</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-pink block mb-2">What We Stand For</span>
            <h2 className="text-3xl font-extrabold text-foreground">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="p-6 rounded-2xl border border-border bg-white hover:border-brand-pink/30 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(233,30,140,0.1)] transition-all duration-300 text-center">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${v.color}`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wholesale CTA */}
        <div className="relative bg-brand-charcoal rounded-3xl p-10 text-center overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-brand-pink/15 blur-2xl" />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-3">Wholesale Inquiries Welcome 🐦</h3>
            <p className="text-white/70 mb-4 max-w-md mx-auto leading-relaxed">
              Available for local pet shops and avian specialists upon request. Every package includes a Care Instructions Card.
            </p>
            <p className="text-brand-pink font-semibold text-sm">
              📧 support@poonchpetstore.com &nbsp;|&nbsp; 📞 +1 (800) 123-4567
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

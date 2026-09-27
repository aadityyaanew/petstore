import { Leaf, ShieldCheck, Heart } from 'lucide-react';

const VALUES = [
  { icon: Leaf, title: 'Natural Materials Only', desc: "We use 100% natural wood and non-toxic materials with zero artificial dyes or harsh chemicals. Your pet's safety is our highest priority." },
  { icon: ShieldCheck, title: 'Pet Health & Well-Being', desc: "Our products are thoughtfully designed to enrich your pet's physical health and mental stimulation — from brain games to activity stands." },
  { icon: Heart, title: 'Crafted with Love', desc: "Each item — from artisan hand-knitted woolen collars to interactive bird stands — is made with care and passion for animals." },
];

const AboutUs = () => {
  return (
    <div className="w-full bg-white selection:bg-[#E050D0]/20 selection:text-[#E050D0]">
      {/* Hero Section */}
      <div className="relative w-full min-h-[45vh] md:min-h-[50vh] flex items-center bg-slate-950 overflow-hidden mb-12 sm:mb-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/asset-b8e1a86b.jpeg" 
            alt="About Us Background" 
            className="w-full h-full object-cover opacity-20 grayscale"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground mb-4">
            Who We Are
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
            About Poonch Pet Store
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            "Safe Play, Happy Tails & Feathered Friends." — This isn't just our tagline. It's our promise to you and your pets.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center mb-20 sm:mb-28">
          <div className="order-2 lg:order-1 mt-6 lg:mt-0 relative aspect-[4/3] w-full rounded-2xl overflow-hidden border bg-muted shadow-sm">
            <img
              src="/assets/categories/bags.jpg"
              alt="Poonch Pet Store Story"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="order-1 lg:order-2">
            <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground block mb-2 sm:mb-3">Our Story</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 sm:mb-7 text-foreground tracking-tight">
              Dedicated Pet Lovers, Through & Through
            </h2>
            <div className="space-y-4 sm:space-y-5 text-base text-muted-foreground leading-relaxed">
              <p>Welcome to Poonch Pet Store! We are dedicated pet lovers committed to creating safe, engaging, and high-quality accessories for your beloved companions.</p>
              <p>From artisan hand-knitted woolen collars to interactive, natural-wood bird activity stands, our products are crafted to enrich your pet's physical health and mental well-being.</p>
              <p className="p-5 sm:p-6 bg-secondary/50 rounded-xl border border-border text-foreground italic shadow-sm mt-6">
                "We prioritize non-toxic materials, durable designs, and thoughtful details so your pets can play, exercise, and lounge safely — every single day."
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20 sm:mb-28">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground block mb-2 sm:mb-3">What We Stand For</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-card text-card-foreground p-8 rounded-xl border shadow-sm flex flex-col items-center text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary text-secondary-foreground mb-6">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-lg mb-3">{v.title}</h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wholesale CTA */}
        <div className="bg-slate-950 rounded-2xl p-10 sm:p-16 text-center shadow-lg border border-slate-800">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">Wholesale Inquiries Welcome</h3>
            <p className="text-slate-400 mb-8 text-base sm:text-lg leading-relaxed">
              Available for local pet shops and avian specialists upon request. Every package includes a Care Instructions Card.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium">
              <a href="mailto:support@poonchpetstore.com" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800 h-11 px-8 w-full sm:w-auto">
                support@poonchpetstore.com
              </a>
              <a href="tel:+917088202122" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 w-full sm:w-auto">
                +91 7088202122
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

import { Link } from 'react-router-dom';

const SHOP_LINKS = [
  { to: '/products?category=birds', label: 'Bird Accessories' },
  { to: '/products?category=cats', label: 'Cat Collars' },
  { to: '/products?category=dogs', label: 'Dog Accessories' },
  { to: '/products?sort=newest', label: 'New Arrivals' },
  { to: '/products?sale=true', label: 'On Sale' },
];

const SUPPORT_LINKS = [
  { to: '/faq', label: 'FAQ' },
  { to: '/shipping', label: 'Shipping' },
  { to: '/returns', label: 'Returns' },
  { to: '/contact', label: 'Contact Us' },
];

const COMPANY_LINKS = [
  { to: '/about', label: 'About Us' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
];

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com/poonchpetstore' },
  { label: 'Facebook', href: 'https://facebook.com/poonchpetstore' },
  { label: 'Pinterest', href: 'https://pinterest.com/poonchpetstore' },
  { label: 'YouTube', href: 'https://youtube.com/@poonchpetstore' },
];

const Footer = () => {
  return (
    <footer className="bg-brand-charcoal text-white pt-16 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">

          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 group w-fit">
              <img
                src="/assets/logowhite.jpeg"
                alt="Poonch Pet Store"
                className="w-12 h-12 rounded-full object-cover border-2 border-brand-pink/40 group-hover:border-brand-pink transition-all"
              />
              <div>
                <p className="font-extrabold text-base leading-none">Poonch Pet Store</p>
                <p className="text-[10px] text-brand-pink font-bold uppercase tracking-wider mt-0.5">
                  Safe Play, Happy Tails 🐾
                </p>
              </div>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs mb-5">
              Poonch Pet Store is dedicated to delivering safe, non-toxic, and engaging accessories designed to enrich the lives of pets and their humans.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-pink/30 text-white/70 hover:bg-brand-pink hover:border-brand-pink hover:text-white transition-all duration-200"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-pink mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-white/60 hover:text-brand-pink transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-pink mb-4">Support</h3>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-white/60 hover:text-brand-pink transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-pink mb-4">Company</h3>
            <ul className="space-y-2.5 mb-6">
              {COMPANY_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-white/60 hover:text-brand-pink transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-pink mb-3">Contact</h3>
            <div className="space-y-1.5 text-sm text-white/60">
              <p>📧 support@poonchpetstore.com</p>
              <p>📞 +1 (800) 123-4567</p>
              <p>📍 123 Pet Care Way, Suite A</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-pink/12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Poonch Pet Store. All rights reserved.
          </p>
          <p className="text-xs text-white/30 italic">
            Safe Play, Happy Tails & Feathered Friends 🐾🐦
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

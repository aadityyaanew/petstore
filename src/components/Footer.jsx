import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const COMPANY_LINKS = [
  { to: '/about', label: 'About Us' },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/faq', label: 'FAQ & Care' },
];

const USEFUL_LINKS = [
  { to: '/products', label: 'All Products' },
  { to: '/products?category=Toys', label: 'Bird Toys & Stands' },
  { to: '/products?category=Clothing', label: 'Cat Accessories' },
  { to: '/products?category=Furniture', label: 'Perches & Gyms' },
];

const CUSTOMER_SERVICE_LINKS = [
  { to: '/contact', label: 'Contact Us' },
  { to: '/shipping', label: 'Shipping Policy' },
  { to: '/returns', label: 'Returns & Refunds' },
  { to: '/orders', label: 'Order Tracking' },
];

const SOCIAL_ICONS = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/poonchpetstore',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/poonchpetstore',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'Pinterest',
    href: 'https://pinterest.com/poonchpetstore',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.546.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@poonchpetstore',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#FAFBFD] text-gray-800 pt-12 sm:pt-16 pb-28 md:pb-14 border-t border-gray-100 overflow-hidden selection:bg-[#E050D0]/20 selection:text-[#E050D0]">
      {/* ── BACKGROUND SCATTERED FEATHER WATERMARKS (Avian Theme) ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.06] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <g id="footerFeather">
              <path
                d="M14 2 C10 6, 4 14, 4 22 C4 28, 8 33, 14 36 C20 33, 24 28, 24 22 C24 14, 18 6, 14 2 Z"
                fill="#111827"
              />
              <path
                d="M14 2 L14 38"
                stroke="#111827"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </g>
          </defs>
          <use href="#footerFeather" x="40" y="50" transform="rotate(-15 40 50) scale(1.1)" />
          <use href="#footerFeather" x="180" y="160" transform="rotate(25 180 160) scale(1.4)" />
          <use href="#footerFeather" x="340" y="40" transform="rotate(-10 340 40) scale(0.9)" />
          <use href="#footerFeather" x="500" y="180" transform="rotate(18 500 180) scale(1.2)" />
          <use href="#footerFeather" x="720" y="60" transform="rotate(-20 720 60) scale(1.0)" />
          <use href="#footerFeather" x="900" y="140" transform="rotate(30 900 140) scale(1.3)" />
          <use href="#footerFeather" x="1100" y="70" transform="rotate(-12 1100 70) scale(1.1)" />
          <use href="#footerFeather" x="1250" y="180" transform="rotate(15 1250 180) scale(1.0)" />
        </svg>
      </div>

      {/* ── BOTTOM-RIGHT DECORATIVE ORGANIC PINK BLOB (Image 1 Mockup) ── */}
      <div
        className="pointer-events-none absolute -bottom-14 -right-14 w-48 h-48 sm:w-60 sm:h-60 rounded-[55%_45%_50%_50%] bg-[#E050D0] opacity-90 z-0"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-8 mb-12 sm:mb-14">

          {/* Column 1 & 2: Brand Info + Mission Statement + Round Socials */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-3 group w-fit">
              <img
                src="/logo.jpeg"
                alt="Poonch Pet Store"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#E050D0]/30 group-hover:ring-[#E050D0] transition-all"
              />
              <span className="font-extrabold text-xl text-gray-900 tracking-tight">
                Poonch Pet Store
              </span>
            </Link>

            <span className="text-[11px] font-bold text-[#E050D0] bg-[#E050D0]/10 px-2.5 py-0.5 rounded-full inline-block mb-3">
              Safe Play, Happy Tails &amp; Feathered Friends.
            </span>

            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-sm mb-6">
              Poonch Pet Store is dedicated to delivering safe, non-toxic, and engaging accessories designed to enrich the lives of pets and their humans.
            </p>

            {/* Social Icons (Round dark badges matching mockup) */}
            <div className="flex items-center gap-2.5">
              {SOCIAL_ICONS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-[#E050D0] transition-all duration-200 transform hover:scale-105 shadow-sm"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-xs sm:text-sm text-gray-500 hover:text-[#E050D0] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Useful links */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-4">
              Useful links
            </h3>
            <ul className="space-y-2.5">
              {USEFUL_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-xs sm:text-sm text-gray-500 hover:text-[#E050D0] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Customer Service */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2.5">
              {CUSTOMER_SERVICE_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-xs sm:text-sm text-gray-500 hover:text-[#E050D0] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 6: Store */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-4">
              Store Location
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-500">
              <li className="leading-snug">
                123 Pet Care Way, Suite A, City, State, ZIP
              </li>
              <li>
                <a href="tel:+18001234567" className="hover:text-[#E050D0] transition-colors font-medium">
                  +1 (800) 123-4567
                </a>
              </li>
              <li>
                <a href="mailto:support@poonchpetstore.com" className="hover:text-[#E050D0] transition-colors font-medium">
                  support@poonchpetstore.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ── BOTTOM ROW: Copyright & Payment Badges ── */}
        <div className="border-t border-gray-200/80 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>
            © copyright Poonch Pet Store. 2026. Design by Figma.guru
          </p>

          {/* Payment Icons (VISA, AMEX, MASTERCARD, PAYPAL) */}
          <div className="flex items-center gap-4 filter grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all">
            {/* VISA */}
            <span className="font-extrabold tracking-wider text-gray-800 text-[13px] font-sans">
              VISA
            </span>

            {/* AMERICAN EXPRESS */}
            <span className="font-bold tracking-tight text-gray-800 text-[10px] uppercase font-sans border border-gray-400 px-1 py-0.5 rounded">
              AMEX
            </span>

            {/* MASTERCARD */}
            <div className="flex items-center -space-x-1.5" title="Mastercard">
              <div className="w-4 h-4 rounded-full bg-[#EB001B] opacity-80" />
              <div className="w-4 h-4 rounded-full bg-[#F79E1B] opacity-80" />
            </div>

            {/* PAYPAL */}
            <span className="font-extrabold italic text-[#003087] text-[13px]">
              Pay<span className="text-[#0079C1]">Pal</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const COMPANY_LINKS = [
  { to: '/about', label: 'About Us' },
  { to: '/products', label: 'Blog' },
  { to: '/products', label: 'Gift cards' },
  { to: '/about', label: 'Careers' },
];

const USEFUL_LINKS = [
  { to: '/products', label: 'New products' },
  { to: '/products', label: 'Best sellers' },
  { to: '/products', label: 'Discount' },
  { to: '/faq', label: 'F.A.Q' },
];

const CUSTOMER_SERVICE_LINKS = [
  { to: '/contact', label: 'Contact Us' },
  { to: '/shipping', label: 'Shipping' },
  { to: '/returns', label: 'Returns' },
  { to: '/orders', label: 'Order tracking' },
];

const SOCIAL_ICONS = [
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z" />
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'Pinterest',
    href: 'https://pinterest.com',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.546.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#FAFBFD] text-gray-800 pt-16 pb-12 border-t border-gray-100 overflow-hidden selection:bg-[#E050D0]/20 selection:text-[#E050D0]">
      {/* ── BACKGROUND SCATTERED PAW WATERMARKS (Mockup Aesthetic) ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.06] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <g id="footerPaw">
              <ellipse cx="14" cy="20" rx="9" ry="7.5" fill="#111827" />
              <circle cx="5" cy="8" r="3.2" fill="#111827" />
              <circle cx="11.5" cy="4" r="3.2" fill="#111827" />
              <circle cx="18" cy="4" r="3.2" fill="#111827" />
              <circle cx="24" cy="8" r="3.2" fill="#111827" />
            </g>
          </defs>
          <use href="#footerPaw" x="40" y="50" transform="rotate(-15 40 50) scale(1.1)" />
          <use href="#footerPaw" x="180" y="160" transform="rotate(25 180 160) scale(1.4)" />
          <use href="#footerPaw" x="340" y="40" transform="rotate(-10 340 40) scale(0.9)" />
          <use href="#footerPaw" x="500" y="180" transform="rotate(18 500 180) scale(1.2)" />
          <use href="#footerPaw" x="720" y="60" transform="rotate(-20 720 60) scale(1.0)" />
          <use href="#footerPaw" x="900" y="140" transform="rotate(30 900 140) scale(1.3)" />
          <use href="#footerPaw" x="1100" y="70" transform="rotate(-12 1100 70) scale(1.1)" />
          <use href="#footerPaw" x="1250" y="180" transform="rotate(15 1250 180) scale(1.0)" />
        </svg>
      </div>

      {/* ── BOTTOM-RIGHT DECORATIVE ORGANIC PINK BLOB (Image 1 Mockup) ── */}
      <div
        className="pointer-events-none absolute -bottom-14 -right-14 w-48 h-48 sm:w-60 sm:h-60 rounded-[55%_45%_50%_50%] bg-[#E050D0] opacity-90 z-0"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 mb-14">

          {/* Column 1 & 2: Brand Info + Description + Round Socials */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <img
                src="/logo.jpeg"
                alt="Pet Shop"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#E050D0]/30 group-hover:ring-[#E050D0] transition-all"
              />
              <span className="font-extrabold text-xl text-gray-900 tracking-tight">
                Pet Shop
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-sm mb-6">
              Sed viverra eget fames sit varius. Pellentesque mattis libero viverra dictumst cras volutpat justo convallis vitae
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
              Store
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-500">
              <li className="leading-snug">
                8582 Fairground St. Tallahassee, FL 32303
              </li>
              <li>
                <a href="tel:+7763786348" className="hover:text-[#E050D0] transition-colors font-medium">
                  +776 378-6348
                </a>
              </li>
              <li>
                <a href="mailto:rgarton@outlook.com" className="hover:text-[#E050D0] transition-colors font-medium">
                  rgarton@outlook.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ── BOTTOM ROW: Copyright & Payment Badges (Mockup Image) ── */}
        <div className="border-t border-gray-200/80 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>
            © copyright Pet Shop. 2026. Design by Figma.guru
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

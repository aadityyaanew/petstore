import React from 'react';

export const BrandPartner1 = ({ className = 'w-12 h-12 text-[#E050D0]' }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
    <ellipse cx="14" cy="24" rx="7" ry="12" transform="rotate(-15 14 24)" />
    <ellipse cx="50" cy="24" rx="7" ry="12" transform="rotate(15 50 24)" />
    <rect x="14" y="14" width="36" height="30" rx="15" />
    <polygon points="32,48 24,42 40,42" />
    <circle cx="25" cy="26" r="2.5" fill="#FFFFFF" />
    <circle cx="39" cy="26" r="2.5" fill="#FFFFFF" />
    <ellipse cx="32" cy="33" rx="3.5" ry="2.5" fill="#FFFFFF" />
    <path d="M29,36 Q32,39 35,36" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

export const BrandPartner2 = ({ className = 'w-12 h-12 text-[#E050D0]' }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
    <path d="M32,8 L10,24 L14,24 L14,56 L50,56 L50,24 L54,24 Z" />
    <path d="M24,56 L24,36 C24,31 40,31 40,36 L40,56 Z" fill="#FFFFFF" />
    <path
      d="M32,38 C34,38 35.5,39.5 35.5,41.5 C35.5,42.5 35,43.5 34.5,44.5 C35.5,45.5 36.5,47 37,49 C37.5,51 38,53.5 38,56 L26,56 C26,54 27,51.5 28,49.5 C29,48 29.5,46 29.5,44.5 C29,43.5 28.5,42.5 28.5,41.5 C28.5,39.5 30,38 32,38 Z"
      fill="currentColor"
    />
    <polygon points="29,40 27,37 30,38" fill="currentColor" />
    <polygon points="35,40 37,37 34,38" fill="currentColor" />
  </svg>
);

export const BrandPartner3 = ({ className = 'w-12 h-12 text-[#E050D0]' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <path
      d="M32,54 C16,40 8,30 8,19 C8,11 14,5 22,5 C27,5 30.5,8 32,12 C33.5,8 37,5 42,5 C50,5 56,11 56,19 C56,30 48,40 32,54 Z"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <g fill="currentColor" transform="translate(34, 15) scale(0.65)">
      <ellipse cx="14" cy="18" rx="8" ry="6.5" />
      <circle cx="5" cy="8" r="3" />
      <circle cx="11" cy="4" r="3" />
      <circle cx="17" cy="4" r="3" />
      <circle cx="23" cy="8" r="3" />
    </g>
    <g fill="currentColor" transform="translate(18, 25) scale(0.65)">
      <ellipse cx="14" cy="18" rx="8" ry="6.5" />
      <circle cx="5" cy="8" r="3" />
      <circle cx="11" cy="4" r="3" />
      <circle cx="17" cy="4" r="3" />
      <circle cx="23" cy="8" r="3" />
    </g>
  </svg>
);

export const BrandPartner4 = ({ className = 'w-12 h-12 text-[#E050D0]' }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
    <path d="M32,28 C22,28 15,36 17,47 C19,55 25,58 32,58 C39,58 45,55 47,47 C49,36 42,28 32,28 Z" />
    <ellipse cx="28" cy="38" rx="2" ry="4" fill="#FFFFFF" opacity="0.4" transform="rotate(-15 28 38)" />
    <ellipse cx="14" cy="22" rx="5" ry="7.5" transform="rotate(-30 14 22)" />
    <ellipse cx="26" cy="13" rx="5.5" ry="8" transform="rotate(-10 26 13)" />
    <ellipse cx="38" cy="13" rx="5.5" ry="8" transform="rotate(10 38 13)" />
    <ellipse cx="50" cy="22" rx="5" ry="7.5" transform="rotate(30 50 22)" />
  </svg>
);

export const BrandPartner5 = ({ className = 'w-12 h-12 text-[#E050D0]' }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
    <path d="M32,56 C14,42 6,31 6,19 C6,10 13,4 22,4 C27,4 30.5,7 32,10.5 C33.5,7 37,4 42,4 C51,4 58,10 58,19 C58,31 50,42 32,56 Z" />
    <circle cx="28" cy="26" r="3" fill="#FFFFFF" />
    <ellipse cx="33" cy="33" rx="4" ry="3" fill="#FFFFFF" />
    <path d="M22,17 Q19,25 21,34 Q28,42 37,38 Q42,30 40,20 Q32,12 22,17 Z" fill="#FFFFFF" />
    <circle cx="31" cy="24" r="2" fill="currentColor" />
    <ellipse cx="35" cy="30" rx="2" ry="1.5" fill="currentColor" />
  </svg>
);

export const BRAND_ITEMS = [
  { id: 1, name: 'Poonch Pet', Component: BrandPartner1 },
  { id: 2, name: 'Natural Pine', Component: BrandPartner2 },
  { id: 3, name: 'Pet Spot', Component: BrandPartner3 },
  { id: 4, name: 'EcoWood', Component: BrandPartner4 },
  { id: 5, name: 'Green Line', Component: BrandPartner5 },
];

export default function BrandPartners() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center justify-items-center">
        {BRAND_ITEMS.map((item, idx) => {
          const Logo = item.Component;
          return (
            <div
              key={idx}
              className="flex flex-col items-center justify-center gap-2.5 group cursor-pointer transition-transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <Logo className="w-14 h-14 text-[#E050D0] drop-shadow-sm group-hover:drop-shadow-md" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#E050D0] tracking-wide transition-colors">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

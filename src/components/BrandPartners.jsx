import React from 'react';

// Avian Brand 1: Perched Bird Silhouette
export const BrandPartner1 = ({ className = 'w-12 h-12 text-[#E050D0]' }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
    {/* Perched Songbird on twig */}
    <circle cx="28" cy="22" r="9" />
    <polygon points="19,22 10,24 19,26" />
    <circle cx="25" cy="20" r="1.5" fill="#FFFFFF" />
    <path d="M28,31 C22,35 18,44 19,53 L38,53 C44,45 42,32 35,28 Z" />
    <path d="M37,35 C45,40 54,48 56,54 L44,54 C40,48 35,42 37,35 Z" opacity="0.85" />
    {/* Branch / Perch */}
    <rect x="6" y="52" width="52" height="4" rx="2" />
  </svg>
);

// Avian Brand 2: Elegant Feather Emblem
export const BrandPartner2 = ({ className = 'w-12 h-12 text-[#E050D0]' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <path
      d="M32 4 C24 14 12 28 12 42 C12 52 20 60 32 60 C44 60 52 52 52 42 C52 28 40 14 32 4 Z"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <path d="M32 4 L32 60" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M32 20 C24 24 18 30 16 38 M32 32 C24 36 20 42 18 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M32 20 C40 24 46 30 48 38 M32 32 C40 36 44 42 46 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Avian Brand 3: Soaring Wings in Circle
export const BrandPartner3 = ({ className = 'w-12 h-12 text-[#E050D0]' }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
    <path
      d="M32 6 C17.6 6 6 17.6 6 32 C6 46.4 17.6 58 32 58 C46.4 58 58 46.4 58 32 C58 17.6 46.4 6 32 6 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
    />
    {/* Flying Bird Wings Silhouette */}
    <path d="M32 26 C24 16 14 14 8 16 C16 23 20 31 24 38 C18 40 10 40 6 38 C12 43 20 47 28 46 C29 50 31 56 32 60 C33 56 35 50 36 46 C44 47 52 43 58 38 C54 40 46 40 40 38 C44 31 48 23 56 16 C50 14 40 16 32 26 Z" />
  </svg>
);

// Avian Brand 4: Natural Wooden Perch & Play Gym
export const BrandPartner4 = ({ className = 'w-12 h-12 text-[#E050D0]' }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
    {/* T-Stand with Bird */}
    <rect x="29" y="18" width="6" height="38" rx="3" />
    <rect x="12" y="16" width="40" height="6" rx="3" />
    <rect x="18" y="52" width="28" height="6" rx="3" />
    {/* Perched bird on left of T */}
    <circle cx="20" cy="10" r="5" />
    <polygon points="15,10 9,11 15,12" />
    <path d="M20,15 C17,16 16,21 17,25 L24,25 C25,20 24,15 20,15 Z" />
  </svg>
);

// Avian Brand 5: Graceful Hummingbird / Swift
export const BrandPartner5 = ({ className = 'w-12 h-12 text-[#E050D0]' }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
    {/* Hummingbird hovering */}
    <circle cx="38" cy="24" r="6" />
    <polygon points="44,24 58,21 44,26" />
    <circle cx="40" cy="23" r="1.2" fill="#FFFFFF" />
    <path d="M38,30 C30,34 22,46 16,56 C24,50 32,44 36,36 Z" />
    <path d="M34,26 C28,14 18,8 8 6 C15 15 22 24 28 28 Z" opacity="0.9" />
    <path d="M37,28 C36,18 32,10 24 6 C28 14 32 22 35 28 Z" opacity="0.6" />
  </svg>
);

export const BRAND_ITEMS = [
  { id: 1, name: 'Poonch Avian', Component: BrandPartner1 },
  { id: 2, name: 'Natural Pine', Component: BrandPartner2 },
  { id: 3, name: 'Feather Care', Component: BrandPartner3 },
  { id: 4, name: 'EcoWood Perches', Component: BrandPartner4 },
  { id: 5, name: 'Green Aviary', Component: BrandPartner5 },
];

export default function BrandPartners() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14">
        {BRAND_ITEMS.map((item, idx) => {
          const Logo = item.Component;
          return (
            <div
              key={idx}
              className="flex flex-col items-center justify-center gap-2 group cursor-pointer transition-transform hover:-translate-y-1 w-[calc(33.333%-1rem)] sm:w-auto"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <Logo className="w-10 h-10 sm:w-14 sm:h-14 text-[#E050D0] drop-shadow-sm group-hover:drop-shadow-md" />
              </div>
              <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-[#E050D0] tracking-wide transition-colors text-center">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

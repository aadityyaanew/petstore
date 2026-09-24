'use client';
import { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Copy, Check, Clock, Phone } from 'lucide-react';

export default function StoreMap() {
  const [copied, setCopied] = useState(false);
  const address = '123 Pet Care Way, Suite A, City, State, ZIP';
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full rounded-[28px] sm:rounded-[36px] overflow-hidden border border-gray-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] bg-[#F3F4F6] group">
      {/* ── MAP CONTAINER ── */}
      <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px]">
        {/* OpenStreetMap Interactive Iframe */}
        <iframe
          title="Poonch Pet Store Location"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-84.3200%2C30.4200%2C-84.2400%2C30.4700&amp;layer=mapnik"
          className="w-full h-full border-0 filter contrast-[1.02] brightness-[1.01]"
          loading="lazy"
        />

        {/* Subtle Map Overlay Tint to match the soft clean aesthetic */}
        <div className="absolute inset-0 bg-[#E050D0]/[0.02] pointer-events-none" />

        {/* ── CENTER PINK PIN MARKER (Matching Mockup Pin) ── */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[90%] pointer-events-none flex flex-col items-center z-20">
          {/* Pulsing ripple ring */}
          <div className="absolute bottom-1 w-10 h-3 bg-[#E050D0]/30 rounded-full animate-ping" />
          <div className="absolute bottom-1.5 w-7 h-2.5 bg-black/25 rounded-full blur-[2px]" />

          {/* Custom Pink Pin */}
          <div className="relative transform hover:scale-110 transition-transform duration-300 drop-shadow-[0_10px_16px_rgba(224,80,208,0.45)]">
            <svg
              width="52"
              height="64"
              viewBox="0 0 52 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-md"
            >
              {/* Pin Body in Pink Gradient */}
              <defs>
                <linearGradient id="pinPinkGrad" x1="0" y1="0" x2="52" y2="64" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FBA8FA" />
                  <stop offset="40%" stopColor="#E050D0" />
                  <stop offset="100%" stopColor="#B828A8" />
                </linearGradient>
              </defs>
              <path
                d="M26 0C11.6406 0 0 11.6406 0 26C0 41.5 22.5 60.5 24.8 62.5C25.5 63.1 26.5 63.1 27.2 62.5C29.5 60.5 52 41.5 52 26C52 11.6406 40.3594 0 26 0Z"
                fill="url(#pinPinkGrad)"
              />
              {/* Inner White Dot (Image 1 Style) */}
              <circle cx="26" cy="25" r="9" fill="#FFFFFF" />
            </svg>
          </div>
        </div>

        {/* ── TOP-LEFT FLOATING STORE BADGE ── */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-gray-100 max-w-[280px] sm:max-w-xs transition-all">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Open Now • Closes 10 PM</span>
          </div>
          <p className="font-extrabold text-sm sm:text-base text-gray-900 leading-tight">
            Poonch Pet Store Flagship Location
          </p>
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">
            123 Pet Care Way, Suite A, City, State, ZIP
          </p>
        </div>

        {/* ── BOTTOM-RIGHT FLOATING ACTION BUTTONS ── */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md text-gray-800 text-xs font-semibold shadow-md border border-gray-100 hover:bg-[#E050D0] hover:text-white transition-all active:scale-95"
            title="Copy address"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Address'}</span>
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E050D0] text-white text-xs font-bold shadow-md hover:bg-[#C030B0] transition-all active:scale-95"
          >
            <Navigation size={14} />
            <span>Get Directions</span>
            <ExternalLink size={12} className="opacity-80" />
          </a>
        </div>
      </div>
    </div>
  );
}

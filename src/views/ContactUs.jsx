'use client';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Mail, Phone, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import StoreMap from '../components/StoreMap';

export default function ContactUs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
      });
      setTimeout(() => setSubmitted(false), 6000);
    }, 600);
  };

  return (
    <div className="relative w-full min-h-screen bg-white text-gray-900 overflow-hidden selection:bg-[#E050D0]/20 selection:text-[#E050D0]">
      {/* ─────────────────────────────────────────────────────────────
          DECORATIVE ORGANIC PINK BLOBS (Matching Mockup Accents)
      ───────────────────────────────────────────────────────────── */}
      {/* Far Left Edge Semi-Circle Blob */}
      <div
        className="pointer-events-none absolute top-[210px] -left-10 w-20 h-44 sm:w-24 sm:h-52 rounded-r-full bg-[#E050D0] opacity-90 blur-[0.5px] z-0"
        aria-hidden="true"
      />

      {/* Top Center Floating Accent Blob */}
      <div
        className="pointer-events-none absolute top-12 left-[32%] w-16 h-14 sm:w-20 sm:h-16 rounded-[45%_55%_65%_35%] bg-[#E050D0] opacity-85 z-0"
        aria-hidden="true"
      />

      {/* Bottom Floating Accent Blob below Hero */}
      <div
        className="pointer-events-none absolute top-[430px] left-[39%] w-16 h-12 sm:w-20 sm:h-14 rounded-[50%_60%_40%_50%] bg-[#E050D0] opacity-85 z-0"
        aria-hidden="true"
      />

      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Image 1 Style in Pink Theme)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-4 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Heading, Subtext, Shop Now Button */}
            <div className="lg:col-span-6 flex flex-col items-start pt-4 sm:pt-8">
              <span className="font-bold text-xs sm:text-sm uppercase tracking-wider text-[#E050D0] mb-3 inline-block">
                Pet Shop
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-tight text-gray-900 leading-[1.12] mb-5">
                If animals could talk, they’d talk about us!
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed max-w-xl mb-8">
                At et vehicula sodales est proin turpis pellentesque sinulla a aliquam amet rhoncus quisque eget sit facilisi blandit et pellentesque aliquet et quisque tortor lacinia nullam
              </p>

              <div>
                <button
                  onClick={() => navigate('/products')}
                  className="inline-flex items-center justify-center font-bold text-sm sm:text-base bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-full transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg cursor-pointer"
                >
                  Shop Now
                </button>
              </div>
            </div>

            {/* Right Column: Circular Organic Pink Blob + Real Asset Photo */}
            <div className="lg:col-span-6 flex justify-center items-center relative">
              <div className="relative w-full max-w-[460px] aspect-[4/3] sm:aspect-square flex items-center justify-center">
                {/* Soft Pink Organic Glow & Shape */}
                <div className="absolute inset-0 bg-[#E050D0] rounded-[52%_48%_63%_37%/43%_58%_42%_57%] transform -rotate-3 transition-transform duration-700 hover:rotate-0" />
                {/* Real Pet Store Feature Photo */}
                <div className="relative z-10 w-[90%] h-[90%] rounded-[48%_52%_40%_60%/55%_45%_55%_45%] overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="/assets/asset-b8e1a86b.jpeg"
                    alt="Poonch Pet Store Friendly Caretaker"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. CONTACT FORM & INFO SECTION (Image 1 Style)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Left Column: Contact Form inside Soft Rounded Card */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="bg-[#F8F9FB] rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 border border-gray-100/90 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
                
                {submitted && (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3 animate-fade-in">
                    <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                    <span>🐾 Thank you! Your message has been sent. We'll be in touch within 24 hours.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* First Name & Last Name (2 Columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-xs sm:text-sm font-bold text-gray-800 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="w-full bg-white rounded-xl border border-gray-200/90 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#E050D0] focus:ring-2 focus:ring-[#E050D0]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-xs sm:text-sm font-bold text-gray-800 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="w-full bg-white rounded-xl border border-gray-200/90 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#E050D0] focus:ring-2 focus:ring-[#E050D0]/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-gray-800 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="E-mail address"
                      className="w-full bg-white rounded-xl border border-gray-200/90 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#E050D0] focus:ring-2 focus:ring-[#E050D0]/20 transition-all"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs sm:text-sm font-bold text-gray-800 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message..."
                      className="w-full bg-white rounded-xl border border-gray-200/90 p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#E050D0] focus:ring-2 focus:ring-[#E050D0]/20 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button (Pill Button in Brand Pink) */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center font-bold text-sm bg-[#E050D0] hover:bg-[#C030B0] text-white px-9 py-3.5 rounded-full shadow-[0_4px_16px_rgba(224,80,208,0.35)] hover:shadow-[0_6px_22px_rgba(224,80,208,0.45)] transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending...</span>
                        </div>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </div>
                </form>

              </div>
            </div>

            {/* Right Column: Contact Details (Image 1 Style) */}
            <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center pt-2 sm:pt-4">
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
                Feel free to contact us
              </h2>

              <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-lg mb-8 sm:mb-10">
                At et vehicula sodales est proin turpis pellentesque sinulla a aliquam amet rhoncus quisque eget sit facilisi blandit et pellentesque aliquet et quisque tortor lacinia nullam
              </p>

              {/* Contact Items with Solid Pink Circle Badges */}
              <div className="space-y-6">
                
                {/* 1. Location */}
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#E050D0] flex items-center justify-center text-white shrink-0 shadow-[0_4px_12px_rgba(224,80,208,0.3)]">
                    <MapPin size={18} strokeWidth={2.2} />
                  </div>
                  <span className="font-bold text-sm sm:text-base text-gray-900">
                    8582 Fairground St. Tallahassee, FL 32303
                  </span>
                </div>

                {/* 2. Email */}
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#E050D0] flex items-center justify-center text-white shrink-0 shadow-[0_4px_12px_rgba(224,80,208,0.3)]">
                    <Mail size={18} strokeWidth={2.2} />
                  </div>
                  <a
                    href="mailto:rgarton@outlook.com"
                    className="font-bold text-sm sm:text-base text-gray-900 hover:text-[#E050D0] transition-colors"
                  >
                    rgarton@outlook.com
                  </a>
                </div>

                {/* 3. Phone */}
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#E050D0] flex items-center justify-center text-white shrink-0 shadow-[0_4px_12px_rgba(224,80,208,0.3)]">
                    <Phone size={18} strokeWidth={2.2} />
                  </div>
                  <a
                    href="tel:+7763786348"
                    className="font-bold text-sm sm:text-base text-gray-900 hover:text-[#E050D0] transition-colors"
                  >
                    +776 378-6348
                  </a>
                </div>

                {/* 4. Business Hours */}
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#E050D0] flex items-center justify-center text-white shrink-0 shadow-[0_4px_12px_rgba(224,80,208,0.3)]">
                    <Clock size={18} strokeWidth={2.2} />
                  </div>
                  <span className="font-bold text-sm sm:text-base text-gray-900">
                    Mon - Fri: 10AM - 10PM
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. MAP SECTION (Image 1 Style with Custom Pink Pin)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-4 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StoreMap />
        </div>
      </section>
    </div>
  );
}

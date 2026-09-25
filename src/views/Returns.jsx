import { CheckCircle } from 'lucide-react';

const STEPS = [
  { emoji: '📋', n: 1, title: 'Initiate Return', desc: 'Log into your account, go to "My Orders", and select the item(s) to return. Generate a return label within 30 days of delivery.' },
  { emoji: '📦', n: 2, title: 'Pack Your Item', desc: 'Ensure the item is unused and in its original packaging. For woolen products, fold gently. For wooden items, use the original wrap.' },
  { emoji: '🚚', n: 3, title: 'Ship It Back', desc: 'Attach the provided return label to the outside of the box and drop it at your nearest carrier location.' },
  { emoji: '💰', n: 4, title: 'Receive Refund', desc: 'Once received and inspected, a full refund or replacement will be processed within 3–5 business days.' },
];

const POLICY_POINTS = [
  'Items must be returned within 30 days of the delivery date.',
  'Merchandise must be unused and in its original packaging with all tags attached.',
  'Damaged or defective items are eligible for an immediate replacement or full refund.',
  'Woolen products must be unwashed and free from pet hair for return eligibility.',
  'Wooden items must be unassembled and free of bite marks for return eligibility.',
  'Original shipping charges are non-refundable unless the return is due to our error.',
];

const Returns = () => {
  return (
    <div>
      <div className="relative bg-brand-charcoal text-white py-12 sm:py-16 md:py-20 overflow-hidden mb-8 sm:mb-12">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-brand-pink/20 blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <span className="pink-badge mb-3 sm:mb-4 inline-block text-xs">Hassle-Free</span>
          <h1 className="text-2xl xs:text-3xl md:text-5xl font-extrabold mb-2.5 sm:mb-3">Returns & Refunds ↩️</h1>
          <p className="text-sm sm:text-base md:text-lg text-white/75 max-w-md mx-auto">
            We want you to love every purchase. Simple, 30-day returns.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-3.5 sm:px-6 pb-16 sm:pb-20">
        {/* Steps */}
        <div className="bg-white rounded-2xl border border-border p-5 sm:p-6 md:p-8 mb-6 sm:mb-8 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">How to Return an Item</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-3 sm:gap-3.5 p-3.5 sm:p-4 rounded-xl bg-brand-pink/3 border border-brand-pink/10 hover:bg-brand-pink/6 hover:border-brand-pink/25 transition-all duration-200">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-pink text-white font-extrabold flex items-center justify-center text-xs sm:text-sm shrink-0">
                  {s.n}
                </div>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-foreground mb-0.5">{s.emoji} {s.title}</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Points */}
        <div className="bg-white rounded-2xl border border-border p-5 sm:p-6 md:p-8 mb-6 sm:mb-8 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-5">Return Policy Details</h2>
          <ul className="space-y-3">
            {POLICY_POINTS.map((p, i) => (
              <li key={i} className="flex gap-2.5 sm:gap-3 items-start text-xs sm:text-sm text-muted-foreground border-b border-border pb-3 last:border-b-0 last:pb-0 leading-relaxed">
                <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-brand-charcoal rounded-2xl p-5 sm:p-6 text-center text-white">
          <p className="font-bold text-base sm:text-lg mb-1">Need Help with a Return?</p>
          <p className="text-white/65 text-xs sm:text-sm mb-3">Our team makes the process seamless for you.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-brand-pink font-semibold text-xs sm:text-sm">
            <a href="mailto:support@poonchpetstore.com" className="hover:underline">
              📧 support@poonchpetstore.com
            </a>
            <span className="hidden sm:inline text-brand-pink/40">|</span>
            <a href="tel:+18001234567" className="hover:underline">
              📞 +1 (800) 123-4567
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;

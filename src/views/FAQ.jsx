import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

const FAQS = [
  { q: "Are your wooden bird stands safe for chewing?", a: "Yes! We use 100% natural wood and non-toxic materials with no artificial dyes or glues. Natural chewing behavior is completely normal for birds and our stands are designed to support it safely.", emoji: "🦜" },
  { q: "How do I clean the wooden bird playstands?", a: "Simply wipe the surface with a dry cloth or soft brush and let it air-dry naturally. Do not submerge or clean with water to protect the natural wood integrity. For stubborn spots, use a slightly damp cloth only.", emoji: "🧹" },
  { q: "How do I wash the woolen cat collars?", a: "Hand-wash gently in cold water with a mild, pet-safe detergent and lay flat to dry. Do not tumble dry or wring. This preserves the shape and softness of the hand-knitted wool.", emoji: "🧶" },
  { q: "What payment methods do you accept?", a: "We accept all major payment methods including Stripe, PayPal, Razorpay, Apple Pay, and Google Pay. All transactions are secured with industry-standard encryption.", emoji: "💳" },
  { q: "How long does shipping take?", a: "Standard processing time is 1–3 business days. Delivery typically takes 3–7 business days depending on your destination. You will receive a tracking link via email once your order is dispatched.", emoji: "📦" },
  { q: "What is your return policy?", a: "We offer 30-day hassle-free returns for unused items in their original packaging. Damaged or defective items are eligible for an immediate replacement or full refund.", emoji: "↩️" },
  { q: "Do you offer wholesale for pet shops?", a: "Yes! We offer wholesale pricing for local pet shops and avian specialists upon request. Please reach out to support@poonchpetstore.com with details about your business.", emoji: "🏪" },
  { q: "Are your products suitable for all bird species?", a: "Our bird accessories are designed for a range of pet birds including parrots, cockatiels, budgerigars, and conures. Each product listing specifies the recommended bird sizes.", emoji: "🐦" },
];

const FAQ = () => {
  return (
    <div>
      {/* Hero */}
      <div className="relative bg-brand-charcoal text-white py-16 md:py-20 overflow-hidden mb-12">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-brand-pink/20 blur-3xl" />
        <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
          <span className="pink-badge mb-4 inline-block">Got Questions?</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Frequently Asked Questions ❓</h1>
          <p className="text-lg text-white/75">
            Find answers to the most common questions about our products and policies.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <Accordion type="single" collapsible className="space-y-0">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl mb-3">
              <AccordionTrigger className="px-5 py-4 text-left font-semibold text-base">
                <span className="flex items-center gap-3">
                  <span className="text-xl">{faq.emoji}</span>
                  {faq.q}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 text-muted-foreground leading-relaxed pl-14">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Still have questions */}
        <div className="mt-10 p-8 text-center rounded-2xl bg-gradient-to-br from-brand-pink/8 to-brand-pink/3 border border-brand-pink/15">
          <p className="text-xl font-bold text-foreground mb-2">Still have questions? 🐾</p>
          <p className="text-muted-foreground mb-3 text-sm">Can't find what you're looking for? Reach out directly.</p>
          <p className="text-brand-pink font-semibold text-sm">
            📧 support@poonchpetstore.com &nbsp;|&nbsp; 📞 +1 (800) 123-4567
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

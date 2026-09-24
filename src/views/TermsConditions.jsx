const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold text-foreground mb-3 pb-2 border-b border-brand-pink/15">{title}</h2>
    <div className="text-muted-foreground leading-relaxed text-sm space-y-2">{children}</div>
  </div>
);

const TermsConditions = () => {
  return (
    <div>
      <div className="relative bg-brand-charcoal text-white py-14 overflow-hidden mb-12">
        <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-brand-pink/20 blur-3xl" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <span className="pink-badge mb-3 inline-block">Legal</span>
          <h1 className="text-4xl font-extrabold mb-2">Terms & Conditions 📜</h1>
          <p className="text-white/60 text-sm">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-white rounded-2xl border border-border p-6 md:p-10 shadow-sm">
          <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
            Welcome to <strong className="text-foreground">Poonch Pet Store</strong> (<strong className="text-brand-pink">www.poonchpetstore.com</strong>). These Terms and Conditions govern the use of our website and services. By accessing this website, you accept these terms in full.
          </p>

          <Section title="1. Use of the Website">
            <p>You must be at least 18 years of age to use this website. You agree to use Poonch Pet Store only for lawful purposes and in a manner that does not infringe the rights of others or inhibit their use and enjoyment of the website.</p>
          </Section>

          <Section title="2. Products and Availability">
            <p>All products — including natural wood bird accessories, hand-knitted cat collars, and other pet accessories — and their prices are subject to change without notice. We reserve the right to limit sales of any product to any person, geographic region, or jurisdiction.</p>
          </Section>

          <Section title="3. Payment and Billing">
            <p>We use secure payment gateways including Stripe, PayPal, Razorpay, Apple Pay, and Google Pay. All transactions are encrypted. By submitting payment information, you represent that you are authorized to use the payment method provided.</p>
          </Section>

          <Section title="4. Shipping and Delivery">
            <p>Standard processing time is 1–3 business days. Delivery typically takes 3–7 business days depending on destination. Tracking links are provided upon dispatch. Poonch Pet Store is not responsible for delays caused by courier services or customs for international orders.</p>
          </Section>

          <Section title="5. Returns and Refunds">
            <p>We offer 30-day hassle-free returns for unused items in their original packaging. Damaged or defective items are eligible for an immediate replacement or full refund. Please review our Returns page for detailed instructions.</p>
          </Section>

          <Section title="6. Intellectual Property">
            <p>Unless otherwise stated, Poonch Pet Store and/or its licensors own all intellectual property rights for all material on this website, including our logo, product designs, photography, and brand identity. All rights are reserved.</p>
          </Section>

          <Section title="7. Limitation of Liability">
            <p>In no event shall Poonch Pet Store, nor any of its officers, directors, or employees, be liable to you for anything arising out of or in any way connected with your use of this website beyond the value of the product(s) purchased.</p>
          </Section>

          <Section title="8. Contact Us">
            <p>📧 support@poonchpetstore.com<br />📞 +1 (800) 123-4567<br />📍 123 Pet Care Way, Suite A, City, State, ZIP</p>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;

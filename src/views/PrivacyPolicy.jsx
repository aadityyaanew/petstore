const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold text-foreground mb-3 pb-2 border-b border-brand-pink/15">{title}</h2>
    <div className="text-muted-foreground leading-relaxed text-sm space-y-2">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
  return (
    <div>
      <div className="relative bg-brand-charcoal text-white py-14 overflow-hidden mb-12">
        <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-brand-pink/20 blur-3xl" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <span className="pink-badge mb-3 inline-block">Legal</span>
          <h1 className="text-4xl font-extrabold mb-2">Privacy Policy 🔒</h1>
          <p className="text-white/60 text-sm">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-white rounded-2xl border border-border p-6 md:p-10 shadow-sm">
          <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
            At <strong className="text-foreground">Poonch Pet Store</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit <strong className="text-brand-pink">www.poonchpetstore.com</strong>.
          </p>

          <Section title="1. Information We Collect">
            <p>We may collect personal information you provide directly, such as your name, email address, shipping address, phone number, and payment information when you make a purchase or create an account. We also collect device and usage information automatically through cookies.</p>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc pl-4 space-y-1.5">
              <li>Process and fulfill your orders, including sending confirmation and tracking emails.</li>
              <li>Communicate about products, services, offers, and promotions.</li>
              <li>Provide customer support and respond to inquiries.</li>
              <li>Improve and optimize our website and user experience.</li>
              <li>Protect against fraudulent transactions.</li>
            </ul>
          </Section>

          <Section title="3. Sharing Your Information">
            <p>We do not sell or rent your personal information. We may share it with trusted third-party service providers (payment processors including Stripe, PayPal, and Razorpay, and shipping carriers) who assist in operating our website. These providers are obligated to keep your information confidential.</p>
          </Section>

          <Section title="4. Data Security">
            <p>We implement SSL encryption and secure payment processing. However, no method of internet transmission is 100% secure, and we cannot guarantee absolute security.</p>
          </Section>

          <Section title="5. Your Rights">
            <p>You have the right to access, correct, or delete your personal information at any time. Contact us at <a href="mailto:support@poonchpetstore.com" className="text-brand-pink font-semibold hover:underline">support@poonchpetstore.com</a> and we'll respond within 30 days.</p>
          </Section>

          <Section title="6. Contact Us">
            <p>📧 support@poonchpetstore.com<br />📞 +1 (800) 123-4567<br />📍 123 Pet Care Way, Suite A, City, State, ZIP</p>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

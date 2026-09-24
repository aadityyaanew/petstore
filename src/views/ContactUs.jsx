import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

const CONTACT_DETAILS = [
  { emoji: '📧', title: 'Email Us', value: 'support@poonchpetstore.com', href: 'mailto:support@poonchpetstore.com' },
  { emoji: '📞', title: 'Call Us', value: '+1 (800) 123-4567', href: 'tel:+18001234567' },
  { emoji: '📍', title: 'Visit Us', value: '123 Pet Care Way, Suite A, City, State, ZIP', href: null },
  { emoji: '⏰', title: 'Business Hours', value: 'Mon–Fri: 9am–6pm EST\nSat: 10am–4pm EST\nSun: Closed', href: null },
];

const SOCIALS = [
  { label: '📸 Instagram', href: 'https://instagram.com/poonchpetstore' },
  { label: '👥 Facebook', href: 'https://facebook.com/poonchpetstore' },
  { label: '📌 Pinterest', href: 'https://pinterest.com/poonchpetstore' },
  { label: '▶️ YouTube', href: 'https://youtube.com/@poonchpetstore' },
];

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-brand-charcoal text-white py-16 md:py-20 overflow-hidden mb-12">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-brand-pink/20 blur-3xl" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <span className="pink-badge mb-4 inline-block">We're Here to Help</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Get in Touch 🐾</h1>
          <p className="text-lg text-white/75 max-w-xl">
            Have a question about our products or your order? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-foreground mb-5">Contact Details</h2>

            {CONTACT_DETAILS.map((d, i) => (
              <div key={i} className="flex gap-3.5 p-4 bg-white rounded-2xl border border-border hover:border-brand-pink/25 hover:shadow-[0_4px_20px_rgba(233,30,140,0.08)] transition-all duration-200">
                <span className="text-2xl shrink-0 mt-0.5">{d.emoji}</span>
                <div>
                  <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-0.5">{d.title}</p>
                  {d.href ? (
                    <a href={d.href} className="text-sm text-brand-pink font-semibold hover:underline">
                      {d.value}
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{d.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Socials */}
            <div className="p-5 bg-brand-charcoal rounded-2xl text-white">
              <p className="font-bold text-sm mb-3">Follow Us 📱</p>
              <div className="flex flex-wrap gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-pink/40 text-white/75 hover:bg-brand-pink hover:border-brand-pink hover:text-white transition-all duration-200"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-1">Send a Message</h2>
              <p className="text-sm text-muted-foreground mb-6">We typically respond within 24 hours on business days.</p>

              {submitted && (
                <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
                  🐾 Thank you! Your message was sent. We'll respond within 24 hours.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold" htmlFor="contact-name">Your Name</label>
                    <Input id="contact-name" name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold" htmlFor="contact-email">Email Address</label>
                    <Input id="contact-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold" htmlFor="contact-subject">Subject</label>
                  <Input id="contact-subject" name="subject" value={form.subject} onChange={handleChange} placeholder="e.g. Question about bird stand..." required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold" htmlFor="contact-message">Message</label>
                  <Textarea id="contact-message" name="message" value={form.message} onChange={handleChange} placeholder="Tell us how we can help..." rows={5} required />
                </div>
                <Button type="submit" variant="secondary" size="lg" className="w-full">
                  Send Message 📨
                </Button>
              </form>
            </div>

            {/* Map Placeholder */}
            <div className="mt-5 bg-brand-pink/5 border border-brand-pink/15 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-2">📍</div>
              <p className="font-bold text-foreground mb-1">Find Us</p>
              <p className="text-sm text-muted-foreground mb-3">123 Pet Care Way, Suite A, City, State, ZIP</p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-pink inline-block text-sm"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

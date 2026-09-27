import { Plus_Jakarta_Sans, Lora } from 'next/font/google';
import '../index.css';
import Script from 'next/script';

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' });
const loraFont = Lora({ subsets: ['latin'], variable: '--font-lora' });

export const metadata = {
  title: 'Poonch Pet Store – Safe Play, Happy Tails & Feathered Friends',
  description: 'Premium pet accessories crafted with care. Natural wood bird stands, hand-knitted cat collars, and more. Non-toxic, durable, and designed to enrich your pet\'s life.',
  keywords: 'pet store, bird accessories, cat collars, dog accessories, natural wood, non-toxic pet toys',
  icons: {
    icon: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
  other: {
    'theme-color': '#E050D0',
    'apple-mobile-web-app-capable': 'yes',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#E050D0',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${loraFont.variable}`}>
      <body className="antialiased min-h-screen bg-background font-sans">
        {children}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

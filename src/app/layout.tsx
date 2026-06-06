import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cool & Denim - Dockers Official Store',
  description: 'Browse our exclusive collection of Dockers clothing at Cool & Denim. Belts, shorts, shoes and more.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="min-h-screen bg-white text-navy font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

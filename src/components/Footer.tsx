import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, InstagramLogo, FacebookLogo } from '@phosphor-icons/react/dist/ssr';

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/dockers-logo.png"
                alt="Dockers"
                width={44}
                height={44}
                className="object-contain brightness-0 invert h-10 w-auto"
              />
              <div className="w-px h-8 bg-white/20" />
              <Image
                src="/cool&denim.png"
                alt="Cool & Denim"
                width={44}
                height={44}
                className="object-contain brightness-0 invert h-10 w-auto"
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Your official Dockers destination. Visit us in-store to explore our full collection of premium denim and casual wear.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest">Navigate</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '#categories', label: 'Categories' },
                { href: '#collection', label: 'Collection' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 hover:text-gold transition-colors text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest">Visit Us</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://share.google/i4TAEq6qU6UZEZRzM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-white/60 hover:text-gold transition-colors text-sm"
                >
                  <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                  <span>Find us on Google Maps</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+12687883625"
                  className="flex items-center gap-2.5 text-white/60 hover:text-gold transition-colors text-sm"
                >
                  <Phone size={16} className="text-gold shrink-0" />
                  <span>+1 (268) 788-3625</span>
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
              <a
                href="https://www.instagram.com/cooldenimanu/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-gold rounded-full flex items-center justify-center transition-colors"
                aria-label="Follow us on Instagram"
              >
                <InstagramLogo size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-gold rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FacebookLogo size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} Cool &amp; Denim - Dockers. All rights reserved.
          </p>
          <Link href="/admin" className="text-white/30 hover:text-white/60 text-xs transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

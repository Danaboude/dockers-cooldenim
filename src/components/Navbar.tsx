'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { List, X } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/', label: 'Home' },
    { href: '#categories', label: 'Categories' },
    { href: '#collection', label: 'Collection' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo area */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/dockers-logo.png"
              alt="Dockers"
              width={48}
              height={48}
              className="object-contain h-10 w-auto"
              priority
            />
            <div className="hidden sm:block w-px h-8 bg-border" />
            <Image
              src="/cool&denim.png"
              alt="Cool & Denim"
              width={48}
              height={48}
              className="object-contain h-10 w-auto hidden sm:block"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-navy hover:text-gold transition-colors duration-200 tracking-wide"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right - mobile logo + hamburger */}
          <div className="flex items-center gap-3">
            <Image
              src="/cool&denim.png"
              alt="Cool & Denim"
              width={36}
              height={36}
              className="object-contain h-8 w-auto sm:hidden"
            />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-navy hover:text-gold transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-border bg-white overflow-hidden"
          >
            <nav className="flex flex-col py-4 px-6 gap-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-base font-medium text-navy hover:text-gold transition-colors py-1"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

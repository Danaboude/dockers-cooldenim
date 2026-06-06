'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import type { Banner } from '@/types';

interface Props {
  banners: Banner[];
}

const PLACEHOLDER_BANNERS: Banner[] = [
  {
    id: 0,
    title: 'New Collection',
    subtitle: 'Discover the latest Dockers styles at Cool & Denim',
    image_url: 'https://picsum.photos/seed/dockers-denim-1/1600/700',
    order: 0,
    active: true,
    created_at: '',
  },
];

export default function BannerSlider({ banners }: Props) {
  const items = banners.length > 0 ? banners : PLACEHOLDER_BANNERS;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % items.length), [items.length]);
  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next, items.length]);

  return (
    <section
      className="relative w-full overflow-hidden bg-navy"
      style={{ height: 'clamp(300px, 55vh, 680px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={items[current].image_url}
            alt={items[current].title || 'Banner'}
            fill
            className="object-cover"
            priority={current === 0}
            sizes="100vw"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy/70 via-navy/30 to-transparent" />

          {/* Text content */}
          {(items[current].title || items[current].subtitle) && (
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-xl"
                >
                  {items[current].title && (
                    <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-3">
                      {items[current].title}
                    </h2>
                  )}
                  {items[current].subtitle && (
                    <p className="text-white/85 text-base sm:text-lg font-light">
                      {items[current].subtitle}
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            aria-label="Previous banner"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            aria-label="Next banner"
          >
            <CaretRight size={20} weight="bold" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to banner ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import type { Category } from '@/types';

interface Props {
  categories: Category[];
}

const PLACEHOLDER_IMAGE = 'https://picsum.photos/seed/dockers-category/600/400';

function CategoryCard({ cat, index }: { cat: Category; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reduced ? {} : { opacity: 0, y: 40, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/category/${cat.slug}`} className="group block">
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-navy shadow-md"
          style={{ aspectRatio: '3/2' }}
        >
          <Image
            src={cat.image_url || PLACEHOLDER_IMAGE}
            alt={cat.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-108"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent transition-opacity duration-300 group-hover:from-navy/95" />

          {/* Hover shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />

          {/* Label */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-white font-bold text-sm sm:text-lg leading-tight">{cat.name}</h3>
              <motion.div
                initial={{ x: 8, opacity: 0 }}
                whileHover={{ x: 0, opacity: 1 }}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-gold/90 rounded-full flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <ArrowRight size={14} weight="bold" className="text-white" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function CategoryGrid({ categories }: Props) {
  if (categories.length === 0) return null;

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const reduced = useReducedMotion();

  return (
    <section id="categories" className="py-12 md:py-20 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={reduced ? {} : { opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-navy">Shop by Category</h2>
          <p className="text-muted mt-1.5 text-sm md:text-base">Explore our full range of Dockers collections</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

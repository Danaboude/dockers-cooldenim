'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import ScrollReveal from './ScrollReveal';
import type { Category } from '@/types';

interface Props {
  categories: Category[];
}

const PLACEHOLDER_IMAGE = 'https://picsum.photos/seed/dockers-category/600/400';

export default function CategoryGrid({ categories }: Props) {
  if (categories.length === 0) return null;

  return (
    <section id="categories" className="py-16 md:py-24 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-navy">Shop by Category</h2>
            <p className="text-muted mt-2 text-base">Explore our full range of Dockers collections</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <ScrollReveal key={cat.id} delay={i * 0.08}>
              <Link href={`/category/${cat.slug}`} className="group block">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative overflow-hidden rounded-2xl bg-navy shadow-md"
                  style={{ aspectRatio: '4/3' }}
                >
                  {/* Image */}
                  <Image
                    src={cat.image_url || PLACEHOLDER_IMAGE}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent transition-opacity duration-300 group-hover:from-navy/90" />

                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-bold text-lg leading-tight">{cat.name}</h3>
                      <div className="w-8 h-8 bg-gold/90 rounded-full flex items-center justify-center transform translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        <ArrowRight size={16} weight="bold" className="text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

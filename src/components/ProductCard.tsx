'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Tag, ArrowRight } from '@phosphor-icons/react';
import type { Product } from '@/types';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = product.images || [];
  const availableSizes = (product.sizes || []).filter((s) => s.quantity > 0);

  const displayImg =
    images.length > 0
      ? images[imgIdx]?.display || images[imgIdx]?.url
      : 'https://picsum.photos/seed/product-placeholder/600/600';

  return (
    <Link href={`/product/${product.id}`} className="block">
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-border group h-full"
      >
        {/* Image */}
        <div
          className="relative overflow-hidden bg-off-white"
          style={{ aspectRatio: '1/1' }}
          onMouseEnter={() => images.length > 1 && setImgIdx(1)}
          onMouseLeave={() => setImgIdx(0)}
        >
          <Image
            src={displayImg}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />

          {/* Category badge */}
          {product.category_name && (
            <div className="absolute top-2.5 left-2.5">
              <span className="bg-navy/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {product.category_name}
              </span>
            </div>
          )}

          {/* View arrow */}
          <div className="absolute bottom-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 shadow-sm">
            <ArrowRight size={14} weight="bold" className="text-navy" />
          </div>

          {/* Image dots */}
          {images.length > 1 && (
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.slice(0, 4).map((_, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setImgIdx(i)}
                  onClick={(e) => { e.preventDefault(); setImgIdx(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === imgIdx ? 'bg-gold w-4' : 'bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4">
          <h3 className="font-semibold text-navy text-sm leading-snug mb-2 line-clamp-2 group-hover:text-navy-light transition-colors">
            {product.name}
          </h3>

          {/* Available sizes */}
          {availableSizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {availableSizes.slice(0, 5).map((s) => (
                <span
                  key={s.size}
                  className="text-[10px] border border-border text-muted px-1.5 py-0.5 rounded font-medium"
                >
                  {s.size}
                </span>
              ))}
              {availableSizes.length > 5 && (
                <span className="text-[10px] text-muted">+{availableSizes.length - 5}</span>
              )}
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-1 mt-1.5">
              <Tag size={10} className="text-gold shrink-0" />
              {product.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[10px] text-gold/80 font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.article>
    </Link>
  );
}

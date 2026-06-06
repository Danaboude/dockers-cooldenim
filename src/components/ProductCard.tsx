'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Tag } from '@phosphor-icons/react';
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
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-border"
    >
      {/* Image container */}
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
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Category badge */}
        {product.category_name && (
          <div className="absolute top-3 left-3">
            <span className="bg-navy/90 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {product.category_name}
            </span>
          </div>
        )}

        {/* Image dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.slice(0, 4).map((_, i) => (
              <button
                key={i}
                onMouseEnter={() => setImgIdx(i)}
                onClick={() => setImgIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === imgIdx ? 'bg-gold w-4' : 'bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-navy text-base leading-snug mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Available sizes */}
        {availableSizes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {availableSizes.map((s) => (
              <span
                key={s.size}
                className="text-xs border border-border text-muted px-2 py-0.5 rounded-md font-medium hover:border-navy hover:text-navy transition-colors"
              >
                {s.size}
              </span>
            ))}
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Tag size={12} className="text-gold mt-0.5" />
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs text-gold/80 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

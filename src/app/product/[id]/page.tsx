'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  CaretLeft,
  CaretRight,
  Tag,
  Package,
  GridFour,
} from '@phosphor-icons/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LocationButton from '@/components/LocationButton';
import type { Product } from '@/types';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        // getAllProducts includes inactive; get from all
        const found = (data.data as Product[])?.find((p) => p.id === parseInt(id));
        setProduct(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const images = product?.images || [];
  const availableSizes = (product?.sizes || []).filter((s) => s.quantity > 0);
  const unavailableSizes = (product?.sizes || []).filter((s) => s.quantity === 0);

  const goPrev = () => {
    setDirection(-1);
    setActiveImg((i) => (i - 1 + images.length) % images.length);
  };
  const goNext = () => {
    setDirection(1);
    setActiveImg((i) => (i + 1) % images.length);
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-16 md:pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-navy border-t-transparent rounded-full animate-spin" />
            <p className="text-muted text-sm">Loading product...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-16 md:pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-xl font-bold text-navy mb-2">Product not found</p>
            <Link href="/" className="text-gold text-sm hover:underline">Back to Home</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const currentDisplay = images[activeImg]?.display || images[activeImg]?.url || 'https://picsum.photos/seed/product/800/800';

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16 md:pt-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-muted hover:text-navy text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} weight="bold" />
            Back
          </button>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* ---- LEFT: Image Gallery ---- */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              {/* Main image */}
              <div className="relative overflow-hidden rounded-2xl bg-off-white aspect-square">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={activeImg}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -40 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={currentDisplay}
                      alt={`${product.name} - image ${activeImg + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center text-navy shadow-sm transition-all hover:scale-110"
                    >
                      <CaretLeft size={18} weight="bold" />
                    </button>
                    <button
                      onClick={goNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center text-navy shadow-sm transition-all hover:scale-110"
                    >
                      <CaretRight size={18} weight="bold" />
                    </button>
                  </>
                )}

                {/* Image counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-navy/70 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {activeImg + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => { setDirection(i > activeImg ? 1 : -1); setActiveImg(i); }}
                      className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        i === activeImg ? 'border-navy' : 'border-border hover:border-navy/40'
                      }`}
                    >
                      <Image
                        src={img.thumb || img.url}
                        alt={`Thumbnail ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ---- RIGHT: Product Info ---- */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-6"
            >
              {/* Category */}
              {product.category_name && (
                <Link
                  href={`/category/${product.category_slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy/60 hover:text-gold uppercase tracking-widest transition-colors w-fit"
                >
                  <GridFour size={14} />
                  {product.category_name}
                </Link>
              )}

              {/* Name */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy leading-tight">
                {product.name}
              </h1>

              {/* Description */}
              {product.description && (
                <p className="text-muted text-base leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Available Sizes */}
              {availableSizes.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-navy mb-3 flex items-center gap-2">
                    <Package size={16} className="text-gold" />
                    Available Sizes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((s) => (
                      <motion.div
                        key={s.size}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-4 py-2 bg-navy text-white text-sm font-semibold rounded-xl cursor-default select-none"
                      >
                        {s.size}
                        {s.quantity <= 3 && (
                          <span className="ml-1.5 text-gold text-xs">({s.quantity} left)</span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Out of stock sizes */}
              {unavailableSizes.length > 0 && (
                <div>
                  <p className="text-xs text-muted mb-2 font-medium">Out of Stock</p>
                  <div className="flex flex-wrap gap-2">
                    {unavailableSizes.map((s) => (
                      <div
                        key={s.size}
                        className="px-3 py-1.5 border border-border text-muted text-sm rounded-xl line-through opacity-50 cursor-not-allowed select-none"
                      >
                        {s.size}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Visit store CTA */}
              <motion.a
                href="https://share.google/i4TAEq6qU6UZEZRzM"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 w-full bg-navy hover:bg-navy-light text-white font-semibold py-3.5 rounded-2xl transition-colors text-sm mt-2"
              >
                Find Us In-Store
              </motion.a>

              <a
                href="tel:+12687883625"
                className="flex items-center justify-center gap-2 w-full border-2 border-navy text-navy font-semibold py-3.5 rounded-2xl hover:bg-navy/5 transition-colors text-sm"
              >
                Call Us: +1 (268) 788-3625
              </a>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex items-center flex-wrap gap-2 pt-2">
                  <Tag size={14} className="text-gold shrink-0" />
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gold/10 text-navy font-medium px-3 py-1 rounded-full capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
      <LocationButton />
    </main>
  );
}

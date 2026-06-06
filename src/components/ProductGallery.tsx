import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';
import type { Product } from '@/types';

interface Props {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export default function ProductGallery({ products, title = 'Full Collection', subtitle }: Props) {
  return (
    <section id="collection" className="py-14 md:py-20 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-navy">{title}</h2>
            {subtitle && <p className="text-muted mt-2">{subtitle}</p>}
          </div>
        </ScrollReveal>

        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-muted text-lg">No products available yet.</p>
            <p className="text-muted/60 text-sm mt-1">Check back soon for new arrivals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {products.map((product, i) => (
              <ScrollReveal key={product.id} delay={Math.min(i * 0.04, 0.4)}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

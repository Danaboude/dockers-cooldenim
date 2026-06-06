import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';
import type { Product } from '@/types';

interface Props {
  tag: string;
  products: Product[];
}

export default function TagSection({ tag, products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-navy capitalize">{tag}</h2>
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted font-medium whitespace-nowrap">
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {products.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 0.06}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

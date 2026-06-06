import { getCategories, getProductsByCategory } from '@/lib/db';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  let categories = [];
  let products = [];

  try {
    [categories, products] = await Promise.all([
      getCategories(),
      getProductsByCategory(slug),
    ]);
  } catch {
    return notFound();
  }

  const category = categories.find((c) => c.slug === slug);
  if (!category) return notFound();

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16 md:pt-20">
        {/* Header */}
        <div className="bg-navy text-white py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-gold text-sm mb-6 transition-colors">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold">{category.name}</h1>
            <p className="text-white/60 mt-2">{products.length} {products.length === 1 ? 'item' : 'items'} available</p>
          </div>
        </div>

        {/* Products grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          {products.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted text-lg">No products in this category yet.</p>
              <Link href="/" className="mt-4 inline-block text-sm text-gold hover:underline">
                Browse all products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
              {products.map((product, i) => (
                <ScrollReveal key={product.id} delay={Math.min(i * 0.05, 0.4)}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

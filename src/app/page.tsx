import { getBanners, getCategories, getProducts } from '@/lib/db';
import Navbar from '@/components/Navbar';
import BannerSlider from '@/components/BannerSlider';
import CategoryGrid from '@/components/CategoryGrid';
import TagSection from '@/components/TagSection';
import ProductGallery from '@/components/ProductGallery';
import Footer from '@/components/Footer';
import LocationButton from '@/components/LocationButton';

export const revalidate = 60;

export default async function HomePage() {
  let banners: Awaited<ReturnType<typeof getBanners>> = [];
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let products: Awaited<ReturnType<typeof getProducts>> = [];

  try {
    [banners, categories, products] = await Promise.all([
      getBanners(),
      getCategories(),
      getProducts(),
    ]);
  } catch {
    // DB not initialized yet - show empty state
  }

  // Get all unique tags that have at least 1 product
  const allTags = Array.from(
    new Set(products.flatMap((p) => p.tags || []))
  ).filter(Boolean);

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16 md:pt-20">
        <BannerSlider banners={banners} />
        {categories.length > 0 && <CategoryGrid categories={categories} />}

        {/* Tag-based sections */}
        {allTags.map((tag) => (
          <TagSection
            key={tag}
            tag={tag}
            products={products.filter((p) => p.tags?.includes(tag))}
          />
        ))}

        {/* Full gallery */}
        <ProductGallery
          products={products}
          title="All Products"
          subtitle="Browse our complete collection of Dockers at Cool &amp; Denim"
        />

        {products.length === 0 && categories.length === 0 && (
          <div className="py-32 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-off-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👕</span>
              </div>
              <h2 className="text-xl font-bold text-navy mb-2">Collection Coming Soon</h2>
              <p className="text-muted text-sm">
                Visit us in-store to explore our full range of Dockers products at Cool &amp; Denim.
              </p>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <LocationButton />
    </main>
  );
}

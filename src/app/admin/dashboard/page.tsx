import { getAllBanners, getAllCategories, getAllProducts } from '@/lib/db';
import Link from 'next/link';
import { Image as ImageIcon, GridFour, Package, ArrowRight } from '@phosphor-icons/react/dist/ssr';

export const revalidate = 0;

export default async function Dashboard() {
  let banners: Awaited<ReturnType<typeof getAllBanners>> = [];
  let categories: Awaited<ReturnType<typeof getAllCategories>> = [];
  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  try {
    [banners, categories, products] = await Promise.all([
      getAllBanners(),
      getAllCategories(),
      getAllProducts(),
    ]);
  } catch {
    // DB may not be initialized
  }

  const stats = [
    { label: 'Active Banners', value: banners.filter((b) => b.active).length, total: banners.length, href: '/admin/banners', icon: ImageIcon, color: 'bg-blue-50 text-blue-600' },
    { label: 'Categories', value: categories.filter((c) => c.active).length, total: categories.length, href: '/admin/categories', icon: GridFour, color: 'bg-green-50 text-green-600' },
    { label: 'Products', value: products.filter((p) => p.active).length, total: products.length, href: '/admin/products', icon: Package, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Welcome back! Here's an overview of your store.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {stats.map(({ label, value, total, href, icon: Icon, color }) => (
          <Link key={label} href={href} className="group bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={20} weight="fill" />
              </div>
              <ArrowRight size={16} className="text-muted group-hover:text-navy transition-colors" />
            </div>
            <p className="text-3xl font-bold text-navy">{value}</p>
            <p className="text-sm text-muted mt-1">{label} <span className="text-muted/60">/ {total} total</span></p>
          </Link>
        ))}
      </div>

      {/* DB Init helper */}
      {banners.length === 0 && categories.length === 0 && products.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-amber-800 mb-2">First Time Setup</h3>
          <p className="text-sm text-amber-700 mb-4">
            Initialize the database to start adding banners, categories, and products.
          </p>
          <InitDbButton />
        </div>
      )}

      {/* Recent products */}
      {products.length > 0 && (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-navy">Recent Products</h2>
            <Link href="/admin/products" className="text-sm text-gold hover:underline">View all</Link>
          </div>
          <table className="w-full admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 8).map((p) => (
                <tr key={p.id}>
                  <td className="font-medium text-navy text-sm">{p.name}</td>
                  <td className="text-sm text-muted">{p.category_name || '-'}</td>
                  <td className="text-sm text-muted">
                    {p.tags?.slice(0, 2).join(', ') || '-'}
                  </td>
                  <td>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function InitDbButton() {
  return (
    <form action={async () => {
      'use server';
      const { initDb } = await import('@/lib/db');
      await initDb();
    }}>
      <button
        type="submit"
        className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        Initialize Database
      </button>
    </form>
  );
}

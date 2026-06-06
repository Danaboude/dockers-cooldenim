'use client';
import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { Plus, PencilSimple, Trash, X, Check, Spinner } from '@phosphor-icons/react';
import ImageUpload, { UploadedImage } from '@/components/admin/ImageUpload';
import SizeManager, { SizeEntry } from '@/components/admin/SizeManager';
import TagInput from '@/components/admin/TagInput';
import type { Product, Category } from '@/types';

interface FormState {
  name: string;
  category_id: string;
  description: string;
  tags: string[];
  featured: boolean;
  active: boolean;
  sizes: SizeEntry[];
  images: UploadedImage[];
}

const emptyForm: FormState = {
  name: '',
  category_id: '',
  description: '',
  tags: [],
  featured: false,
  active: true,
  sizes: [],
  images: [],
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const [pRes, cRes] = await Promise.all([fetch('/api/products'), fetch('/api/categories')]);
    const pData = await pRes.json();
    const cData = await cRes.json();
    setProducts(pData.data || []);
    setCategories(cData.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditing(null); setShowForm(true); };
  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      category_id: p.category_id?.toString() || '',
      description: p.description || '',
      tags: p.tags || [],
      featured: p.featured,
      active: p.active,
      sizes: (p.sizes || []).map((s) => ({ size: s.size, quantity: s.quantity })),
      images: (p.images || []).map((img) => ({ url: img.url, display: img.display || img.url, thumb: img.thumb || img.url })),
    });
    setEditing(p.id);
    setShowForm(true);
  };

  const del = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    await load();
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      name: form.name,
      category_id: form.category_id ? parseInt(form.category_id) : null,
      description: form.description || null,
      tags: form.tags,
      featured: form.featured,
      active: form.active,
      sizes: form.sizes,
      images: form.images,
    };
    if (editing) {
      await fetch(`/api/products/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } else {
      await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }
    setShowForm(false);
    setSaving(false);
    await load();
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.tags?.some((t) => t.includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Products</h1>
          <p className="text-muted text-sm mt-1">{products.length} products in your collection</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-navy text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-navy-light transition-colors">
          <Plus size={16} weight="bold" /> Add Product
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-navy text-lg">{editing ? 'Edit Product' : 'New Product'}</h2>
            <button onClick={() => setShowForm(false)} className="text-muted hover:text-navy p-1"><X size={22} /></button>
          </div>
          <form onSubmit={save} className="space-y-6">
            {/* Basic info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Product Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Dockers Alpha Slim Belt"
                  className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-navy transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Category</label>
                <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-navy transition-colors bg-white">
                  <option value="">No category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Description (optional)</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3} placeholder="Brief product description..."
                className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-navy transition-colors resize-none" />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Tags <span className="text-muted font-normal">(used for homepage sections)</span>
              </label>
              <TagInput tags={form.tags} onChange={(tags) => setForm({ ...form, tags })}
                placeholder="Type a tag and press Enter (e.g. featured, new-arrivals, sale)" />
              <p className="text-xs text-muted mt-1.5">Each tag creates a section on the homepage with all products sharing that tag.</p>
            </div>

            {/* Options row */}
            <div className="flex flex-wrap gap-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-navy" />
                <span className="text-sm font-medium text-navy">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-navy" />
                <span className="text-sm font-medium text-navy">Active (visible on site)</span>
              </label>
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium text-navy mb-3">
                Sizes &amp; Quantities <span className="text-muted font-normal">(qty = 0 means size is hidden on site)</span>
              </label>
              <SizeManager sizes={form.sizes} onChange={(sizes) => setForm({ ...form, sizes })} />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">
                Product Images <span className="text-muted font-normal">(first image is the main display, hover shows second)</span>
              </label>
              <ImageUpload maxImages={8} images={form.images} onChange={(images) => setForm({ ...form, images })} />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm text-muted border border-border rounded-xl hover:bg-off-white transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-navy text-white text-sm font-medium rounded-xl hover:bg-navy-light transition-colors disabled:opacity-60">
                {saving ? <Spinner size={14} className="animate-spin" /> : <Check size={14} weight="bold" />}
                {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name, category, or tag..."
          className="w-full max-w-sm px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-navy transition-colors bg-white" />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-muted flex items-center justify-center gap-2">
            <Spinner size={20} className="animate-spin" /> Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted text-sm">{search ? 'No products match your search.' : 'No products yet. Add your first product!'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full admin-table min-w-[600px]">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Sizes</th>
                  <th>Tags</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const availSizes = (p.sizes || []).filter((s) => s.quantity > 0);
                  const thumb = p.images?.[0]?.thumb || p.images?.[0]?.url;
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-off-white shrink-0">
                          {thumb
                            ? <Image src={thumb} alt={p.name} fill className="object-cover" sizes="48px" />
                            : <div className="w-full h-full bg-navy/10 flex items-center justify-center text-xs text-muted">-</div>
                          }
                        </div>
                      </td>
                      <td className="text-sm font-semibold text-navy max-w-[200px]">
                        <p className="truncate">{p.name}</p>
                      </td>
                      <td className="text-sm text-muted whitespace-nowrap">{p.category_name || '-'}</td>
                      <td>
                        <div className="flex flex-wrap gap-1 max-w-[140px]">
                          {availSizes.slice(0, 4).map((s) => (
                            <span key={s.size} className="text-xs bg-off-white border border-border px-1.5 py-0.5 rounded text-navy">{s.size}</span>
                          ))}
                          {availSizes.length > 4 && <span className="text-xs text-muted">+{availSizes.length - 4}</span>}
                          {availSizes.length === 0 && <span className="text-xs text-red-400">None</span>}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1 max-w-[140px]">
                          {(p.tags || []).slice(0, 2).map((t) => (
                            <span key={t} className="text-xs bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full font-medium">{t}</span>
                          ))}
                          {(p.tags || []).length > 2 && <span className="text-xs text-muted">+{(p.tags || []).length - 2}</span>}
                        </div>
                      </td>
                      <td>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.active ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(p)} className="p-1.5 text-navy hover:bg-off-white rounded-lg transition-colors" title="Edit"><PencilSimple size={16} /></button>
                          <button onClick={() => del(p.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

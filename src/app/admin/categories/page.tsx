'use client';
import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { Plus, PencilSimple, Trash, X, Check, Spinner } from '@phosphor-icons/react';
import ImageUpload, { UploadedImage } from '@/components/admin/ImageUpload';
import type { Category } from '@/types';

interface FormState {
  name: string;
  order: number;
  active: boolean;
  uploadedImages: UploadedImage[];
}

const empty: FormState = { name: '', order: 0, active: true, uploadedImages: [] };

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = (c: Category) => {
    setForm({
      name: c.name,
      order: c.order,
      active: c.active,
      uploadedImages: c.image_url ? [{ url: c.image_url, display: c.image_url, thumb: c.image_url }] : [],
    });
    setEditing(c.id);
    setShowForm(true);
  };

  const del = async (id: number) => {
    if (!confirm('Delete this category? Products in it won\'t be deleted.')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    await load();
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const imgUrl = form.uploadedImages[0]?.url || null;
    const body = { name: form.name, slug: toSlug(form.name), image_url: imgUrl, order: form.order, active: form.active };
    if (editing) {
      await fetch(`/api/categories/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } else {
      await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }
    setShowForm(false);
    setSaving(false);
    await load();
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Categories</h1>
          <p className="text-muted text-sm mt-1">Manage product categories (belts, shorts, shoes...)</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-navy text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-navy-light transition-colors">
          <Plus size={16} weight="bold" /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-navy">{editing ? 'Edit Category' : 'New Category'}</h2>
            <button onClick={() => setShowForm(false)} className="text-muted hover:text-navy"><X size={20} /></button>
          </div>
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-navy mb-1.5">Category Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Belts, Shorts, Shoes..."
                  className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-navy transition-colors" />
                {form.name && (
                  <p className="text-xs text-muted mt-1">Slug: <span className="font-mono text-navy">{toSlug(form.name)}</span></p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Display Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-navy transition-colors" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="cat-active" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-navy" />
              <label htmlFor="cat-active" className="text-sm font-medium text-navy cursor-pointer">Active (visible on site)</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Category Image</label>
              <ImageUpload maxImages={1} images={form.uploadedImages} onChange={(imgs) => setForm({ ...form, uploadedImages: imgs })} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted border border-border rounded-xl hover:bg-off-white transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-navy text-white text-sm font-medium rounded-xl hover:bg-navy-light transition-colors disabled:opacity-60">
                {saving ? <Spinner size={14} className="animate-spin" /> : <Check size={14} weight="bold" />}
                {saving ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-muted">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted text-sm">No categories yet. Add your first category!</p>
          </div>
        ) : (
          <table className="w-full admin-table">
            <thead><tr><th>Image</th><th>Name</th><th>Slug</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-off-white">
                      {c.image_url
                        ? <Image src={c.image_url} alt={c.name} fill className="object-cover" sizes="56px" />
                        : <div className="w-full h-full bg-navy/10 flex items-center justify-center text-xs text-muted">-</div>
                      }
                    </div>
                  </td>
                  <td className="text-sm font-medium text-navy">{c.name}</td>
                  <td><code className="text-xs bg-off-white px-2 py-0.5 rounded text-muted">{c.slug}</code></td>
                  <td className="text-sm text-muted">{c.order}</td>
                  <td>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="p-1.5 text-navy hover:bg-off-white rounded-lg transition-colors"><PencilSimple size={16} /></button>
                      <button onClick={() => del(c.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

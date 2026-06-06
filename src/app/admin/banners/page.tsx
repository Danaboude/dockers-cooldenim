'use client';
import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { Plus, PencilSimple, Trash, X, Check, Spinner } from '@phosphor-icons/react';
import ImageUpload, { UploadedImage } from '@/components/admin/ImageUpload';
import type { Banner } from '@/types';

interface FormState {
  title: string;
  subtitle: string;
  image_url: string;
  order: number;
  active: boolean;
  uploadedImages: UploadedImage[];
}

const empty: FormState = { title: '', subtitle: '', image_url: '', order: 0, active: true, uploadedImages: [] };

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/banners');
    const data = await res.json();
    setBanners(data.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = (b: Banner) => {
    setForm({
      title: b.title || '',
      subtitle: b.subtitle || '',
      image_url: b.image_url,
      order: b.order,
      active: b.active,
      uploadedImages: b.image_url ? [{ url: b.image_url, display: b.image_url, thumb: b.image_url }] : [],
    });
    setEditing(b.id);
    setShowForm(true);
  };

  const del = async (id: number) => {
    if (!confirm('Delete this banner?')) return;
    await fetch(`/api/banners/${id}`, { method: 'DELETE' });
    await load();
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const imgUrl = form.uploadedImages[0]?.url || form.image_url;
    if (!imgUrl) { alert('Please upload or provide an image'); setSaving(false); return; }
    const body = { title: form.title, subtitle: form.subtitle, image_url: imgUrl, order: form.order, active: form.active };
    if (editing) {
      await fetch(`/api/banners/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } else {
      await fetch('/api/banners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }
    setShowForm(false);
    setSaving(false);
    await load();
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Banners</h1>
          <p className="text-muted text-sm mt-1">Manage your homepage banner slideshow</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-navy text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-navy-light transition-colors">
          <Plus size={16} weight="bold" /> Add Banner
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-navy">{editing ? 'Edit Banner' : 'New Banner'}</h2>
            <button onClick={() => setShowForm(false)} className="text-muted hover:text-navy"><X size={20} /></button>
          </div>
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Title (optional)</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-navy transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Subtitle (optional)</label>
                <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-navy transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Display Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-navy transition-colors" />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="w-4 h-4 accent-navy" />
                  <span className="text-sm font-medium text-navy">Active</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Banner Image</label>
              <ImageUpload maxImages={1} images={form.uploadedImages} onChange={(imgs) => setForm({ ...form, uploadedImages: imgs })} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted border border-border rounded-xl hover:bg-off-white transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-navy text-white text-sm font-medium rounded-xl hover:bg-navy-light transition-colors disabled:opacity-60">
                {saving ? <Spinner size={14} className="animate-spin" /> : <Check size={14} weight="bold" />}
                {saving ? 'Saving...' : 'Save Banner'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-muted">Loading...</div>
        ) : banners.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted text-sm">No banners yet. Add your first banner!</p>
          </div>
        ) : (
          <table className="w-full admin-table">
            <thead><tr><th>Preview</th><th>Title</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {banners.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className="relative w-20 h-12 rounded-lg overflow-hidden bg-off-white">
                      <Image src={b.image_url} alt={b.title || 'Banner'} fill className="object-cover" sizes="80px" />
                    </div>
                  </td>
                  <td className="text-sm font-medium text-navy">{b.title || <span className="text-muted italic">No title</span>}</td>
                  <td className="text-sm text-muted">{b.order}</td>
                  <td>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${b.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {b.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(b)} className="p-1.5 text-navy hover:bg-off-white rounded-lg transition-colors"><PencilSimple size={16} /></button>
                      <button onClick={() => del(b.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash size={16} /></button>
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

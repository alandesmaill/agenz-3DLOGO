'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '@/components/admin/ImageUploader';

interface FormData {
  name: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  qty: number;
  available: boolean;
  sortOrder: number;
}

const initialForm: FormData = {
  name: '',
  brand: '',
  category: '',
  description: '',
  image: '',
  qty: 1,
  available: true,
  sortOrder: 0,
};

const inputClass =
  'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50 transition-colors text-sm';

export default function RentalItemNewPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [isNewBrand, setIsNewBrand] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/rental-items/categories').then((r) => r.json()).catch(() => []),
      fetch('/api/admin/rental-items/brands').then((r) => r.json()).catch(() => []),
    ]).then(([cats, brnds]: [string[], string[]]) => {
      setCategories(cats);
      if (cats.length === 0) setIsNewCategory(true);
      setBrands(brnds);
      if (brnds.length === 0) setIsNewBrand(true);
    });
  }, []);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.brand.trim() || !form.category.trim()) {
      setError('Name, brand, and category are required.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/admin/rental-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/zx9-hub/rental-items');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to create item.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/zx9-hub/rental-items"
          className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/20 transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white font-['Gibson']">Add Rental Item</h1>
          <p className="text-white/50 text-sm mt-1">Add a new individual rental item</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white mb-1">Item Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Item Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g. ARRI Alexa 35"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Brand *</label>
              {!isNewBrand ? (
                <select
                  value={form.brand}
                  onChange={(e) => {
                    if (e.target.value === '__new__') {
                      setIsNewBrand(true);
                      updateField('brand', '');
                    } else {
                      updateField('brand', e.target.value);
                    }
                  }}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="" disabled className="bg-[#0a0a0a] text-white/30">
                    Select a brand...
                  </option>
                  {brands.map((b) => (
                    <option key={b} value={b} className="bg-[#0a0a0a] text-white">
                      {b}
                    </option>
                  ))}
                  <option value="__new__" className="bg-[#0a0a0a] text-[#00e92c]">
                    + Add new brand
                  </option>
                </select>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => updateField('brand', e.target.value)}
                    placeholder="e.g. ARRI"
                    className={inputClass}
                    autoFocus
                  />
                  {brands.length > 0 && (
                    <button
                      type="button"
                      onClick={() => { setIsNewBrand(false); updateField('brand', ''); }}
                      className="text-xs text-white/40 hover:text-white/70 transition-colors"
                    >
                      ← Back to existing brands
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Category *</label>
            {!isNewCategory ? (
              <select
                value={form.category}
                onChange={(e) => {
                  if (e.target.value === '__new__') {
                    setIsNewCategory(true);
                    updateField('category', '');
                  } else {
                    updateField('category', e.target.value);
                  }
                }}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="" disabled className="bg-[#0a0a0a] text-white/30">
                  Select a category...
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#0a0a0a] text-white">
                    {cat}
                  </option>
                ))}
                <option value="__new__" className="bg-[#0a0a0a] text-[#00e92c]">
                  + Add new category
                </option>
              </select>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  placeholder="e.g. Camera Body"
                  className={inputClass}
                  autoFocus
                />
                {categories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => { setIsNewCategory(false); updateField('category', ''); }}
                    className="text-xs text-white/40 hover:text-white/70 transition-colors"
                  >
                    ← Back to existing categories
                  </button>
                )}
              </div>
            )}
            <p className="text-white/30 text-xs mt-1.5">
              Items with the same category are grouped together — e.g. Camera Body, Lenses, Monitors, Tripod, Batteries
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Description <span className="text-white/30 font-normal">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Short description of the item, specs, or notes..."
              rows={3}
              className={`${inputClass} resize-y`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Quantity</label>
              <input
                type="number"
                value={form.qty}
                onChange={(e) => updateField('qty', parseInt(e.target.value) || 1)}
                min={1}
                className={inputClass}
              />
              <p className="text-white/30 text-xs mt-1.5">Number of units available</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Sort Order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => updateField('sortOrder', parseInt(e.target.value) || 0)}
                min={0}
                className={inputClass}
              />
              <p className="text-white/30 text-xs mt-1.5">Lower numbers appear first within category</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateField('available', !form.available)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.available ? 'bg-[#00e92c]' : 'bg-white/10'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  form.available ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-sm text-white/70">
              {form.available ? 'Available for rental' : 'Unavailable'}
            </span>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Item Image</h2>
          <ImageUploader
            value={form.image}
            onChange={(url) => updateField('image', url)}
            label="Product Photo"
            hint="PNG or JPEG • 400×400px or larger square • Max 2MB"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-black font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Add Item'}
          </button>
          <Link
            href="/zx9-hub/rental-items"
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/20 transition-colors text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

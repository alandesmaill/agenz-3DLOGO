'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '@/components/admin/ImageUploader';

interface FormData {
  name: string;
  image: string;
  sortOrder: number;
  published: boolean;
}

const initialForm: FormData = {
  name: '',
  image: '',
  sortOrder: 0,
  published: true,
};

const inputClass =
  'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50 transition-colors text-sm';

export default function ClientLogoNewPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!form.image) {
      setError('Please upload a logo image.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/admin/client-logos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/admin/client-logos');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to create logo.');
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
          href="/admin/client-logos"
          className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/20 transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white font-['Gibson']">Add Client Logo</h1>
          <p className="text-white/50 text-sm mt-1">Add a new logo to the Trusted By section</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white mb-1">Logo Details</h2>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Client Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. Fibernet"
              className={inputClass}
            />
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
            <p className="text-white/30 text-xs mt-1.5">Lower numbers appear first (0, 1, 2…)</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateField('published', !form.published)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.published ? 'bg-[#00e92c]' : 'bg-white/10'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  form.published ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-sm text-white/70">
              {form.published ? 'Visible on website' : 'Hidden'}
            </span>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Logo Image</h2>
          <ImageUploader
            value={form.image}
            onChange={(url) => updateField('image', url)}
            label="Logo File *"
            hint="SVG or PNG recommended • White or transparent background • Square dimensions • Max 2MB"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-black font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Add Logo'}
          </button>
          <Link
            href="/admin/client-logos"
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/20 transition-colors text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

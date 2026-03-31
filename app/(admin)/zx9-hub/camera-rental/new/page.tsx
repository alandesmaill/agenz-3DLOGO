'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '@/components/admin/ImageUploader';
import ColorPicker from '@/components/admin/ColorPicker';
import ArrayEditor from '@/components/admin/ArrayEditor';

interface FormData {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  cameraBody: string;
  accentColor: string;
  packageImage: string;
  highlights: string[];
  productionSetIncludes: string[];
  published: boolean;
}

const initialForm: FormData = {
  slug: '',
  name: '',
  tagline: '',
  description: '',
  cameraBody: '',
  accentColor: '#00e92c',
  packageImage: '',
  highlights: [],
  productionSetIncludes: [],
  published: false,
};

const inputClass =
  'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50 transition-colors text-sm';

export default function CameraRentalNewPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'name') {
        next.slug = (value as string)
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      setError('Name and slug are required.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/admin/camera-rental', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/zx9-hub/camera-rental');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to create package.');
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
          href="/zx9-hub/camera-rental"
          className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/20 transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white font-['Gibson']">New Camera Package</h1>
          <p className="text-white/50 text-sm mt-1">Create a new equipment rental package</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white mb-1">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g. Cinema Pro Kit"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                placeholder="auto-generated-from-name"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => updateField('tagline', e.target.value)}
              placeholder="Short tagline for the package"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Full description of the camera package..."
              rows={4}
              className={`${inputClass} resize-y`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Camera Body</label>
              <input
                type="text"
                value={form.cameraBody}
                onChange={(e) => updateField('cameraBody', e.target.value)}
                placeholder="e.g. Sony FX6"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Accent Color</label>
              <ColorPicker
                value={form.accentColor}
                onChange={(color) => updateField('accentColor', color)}
              />
            </div>
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
              {form.published ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white mb-1">Images</h2>
          <ImageUploader
            value={form.packageImage}
            onChange={(url) => updateField('packageImage', url)}
            label="Package Image"
            hint="800×600px · webp · /public/images/camera-rental/"
          />
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white mb-1">Lists</h2>
          <ArrayEditor
            value={form.highlights}
            onChange={(val) => updateField('highlights', val)}
            label="Highlights"
            placeholder="Add a highlight..."
          />
          <ArrayEditor
            value={form.productionSetIncludes}
            onChange={(val) => updateField('productionSetIncludes', val)}
            label="Production Set Includes"
            placeholder="Add an item..."
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-black font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? 'Saving...' : 'Create Package'}
          </button>
          <Link
            href="/zx9-hub/camera-rental"
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/20 transition-colors text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

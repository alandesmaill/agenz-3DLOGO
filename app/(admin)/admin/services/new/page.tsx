'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ArrayEditor from '@/components/admin/ArrayEditor';
import ColorPicker from '@/components/admin/ColorPicker';
import IconSelector from '@/components/admin/IconSelector';

interface FormData {
  slug: string;
  number: string;
  title: string;
  accentColor: string;
  overviewDescription: string;
  overviewIconName: string;
  ctaText: string;
  ctaLink: string;
  heroTagline: string;
  heroDescription: string;
  heroStats: { value: string; label: string }[];
  overviewHeading: string;
  overviewParagraphs: string[];
  overviewBenefits: string[];
  ctaHeading: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  sortOrder: number;
  published: boolean;
}

const INITIAL: FormData = {
  slug: '',
  number: '01',
  title: '',
  accentColor: '#00ffff',
  overviewDescription: '',
  overviewIconName: 'Megaphone',
  ctaText: 'Learn More',
  ctaLink: '',
  heroTagline: '',
  heroDescription: '',
  heroStats: [],
  overviewHeading: '',
  overviewParagraphs: [],
  overviewBenefits: [],
  ctaHeading: '',
  ctaDescription: '',
  ctaButtonText: 'Get Started',
  ctaButtonLink: '/contact',
  sortOrder: 0,
  published: true,
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function NewServicePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'title' && typeof value === 'string') {
        next.slug = slugify(value);
        next.ctaLink = `/services/${slugify(value)}`;
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(typeof data.error === 'string' ? data.error : 'Failed to create service');
      }
      const service = await res.json();
      router.push(`/admin/services/${service.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50 transition-colors';
  const labelClass = 'block text-sm font-medium text-white/70 mb-2';

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/services"
          className="p-2 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors"
        >
          <ArrowLeft size={18} className="text-white/60" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white font-['Gibson']">New Service</h1>
          <p className="text-white/50 text-sm mt-1">Create a new service page</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white font-['Gibson']">Basic Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Advertising & Social Media"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                className={inputClass}
              />
              <p className="text-xs text-white/30 mt-1">Auto-generated from title</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Number</label>
              <input
                type="text"
                value={form.number}
                onChange={(e) => updateField('number', e.target.value)}
                placeholder="01"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Sort Order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => updateField('sortOrder', parseInt(e.target.value) || 0)}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Accent Color</label>
            <ColorPicker value={form.accentColor} onChange={(c) => updateField('accentColor', c)} />
          </div>
          <div>
            <label className={labelClass}>Overview Icon</label>
            <IconSelector value={form.overviewIconName} onChange={(v) => updateField('overviewIconName', v)} />
          </div>
          <div>
            <label className={labelClass}>Overview Description *</label>
            <textarea
              value={form.overviewDescription}
              onChange={(e) => updateField('overviewDescription', e.target.value)}
              placeholder="Short description for services grid card..."
              className={`${inputClass} min-h-[80px] resize-y`}
              required
            />
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white font-['Gibson']">Hero Section</h2>
          <div>
            <label className={labelClass}>Tagline *</label>
            <input
              type="text"
              value={form.heroTagline}
              onChange={(e) => updateField('heroTagline', e.target.value)}
              placeholder="Amplify Your Brand..."
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              value={form.heroDescription}
              onChange={(e) => updateField('heroDescription', e.target.value)}
              placeholder="Hero description..."
              className={`${inputClass} min-h-[80px] resize-y`}
              required
            />
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white font-['Gibson']">Overview Section</h2>
          <div>
            <label className={labelClass}>Heading *</label>
            <input
              type="text"
              value={form.overviewHeading}
              onChange={(e) => updateField('overviewHeading', e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <ArrayEditor
            value={form.overviewParagraphs}
            onChange={(v) => updateField('overviewParagraphs', v)}
            label="Paragraphs"
            placeholder="Add paragraph..."
          />
          <ArrayEditor
            value={form.overviewBenefits}
            onChange={(v) => updateField('overviewBenefits', v)}
            label="Benefits"
            placeholder="Add benefit..."
          />
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white font-['Gibson']">CTA Section</h2>
          <div>
            <label className={labelClass}>Heading *</label>
            <input
              type="text"
              value={form.ctaHeading}
              onChange={(e) => updateField('ctaHeading', e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              value={form.ctaDescription}
              onChange={(e) => updateField('ctaDescription', e.target.value)}
              className={`${inputClass} min-h-[80px] resize-y`}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Button Text</label>
              <input
                type="text"
                value={form.ctaButtonText}
                onChange={(e) => updateField('ctaButtonText', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Button Link</label>
              <input
                type="text"
                value={form.ctaButtonLink}
                onChange={(e) => updateField('ctaButtonLink', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-[#050505] font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Creating...' : 'Create Service'}
          </button>
          <Link
            href="/admin/services"
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 text-sm hover:border-white/20 transition-colors"
          >
            Cancel
          </Link>
          <p className="text-xs text-white/30">You can add features after creating the service.</p>
        </div>
      </form>
    </div>
  );
}

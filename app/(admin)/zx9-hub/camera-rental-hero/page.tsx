'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import ArrayEditor from '@/components/admin/ArrayEditor';
import ColorPicker from '@/components/admin/ColorPicker';

interface HeroConfig {
  tagline: string;
  heroImage: string;
  highlights: string[];
  accentColor: string;
}

const inputClass =
  'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50 transition-colors text-sm';

export default function CameraRentalHeroPage() {
  const [form, setForm] = useState<HeroConfig>({
    tagline: '',
    heroImage: '',
    highlights: [],
    accentColor: '#00ffff',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/admin/camera-rental-hero')
      .then((r) => r.json())
      .then((data) => {
        setForm({
          tagline: data.tagline || '',
          heroImage: data.heroImage || '',
          highlights: data.highlights || [],
          accentColor: data.accentColor || '#00ffff',
        });
      })
      .catch(() => setError('Failed to load hero config.'))
      .finally(() => setLoading(false));
  }, []);

  function updateField<K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const res = await fetch('/api/admin/camera-rental-hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess('Hero config saved.');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to save.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="text-[#00e92c] animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white font-['Gibson']">Camera Rental Hero</h1>
        <p className="text-white/50 text-sm mt-1">Edit the hero section of the camera rental page</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 px-4 py-3 bg-[#00e92c]/10 border border-[#00e92c]/20 rounded-xl text-[#00e92c] text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white mb-1">Hero Content</h2>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => updateField('tagline', e.target.value)}
              placeholder="Cinema-Grade Production Packages"
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

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white mb-1">Hero Image</h2>
          <ImageUploader
            value={form.heroImage}
            onChange={(url) => updateField('heroImage', url)}
            label="Hero Image"
            hint="1920×1080px · webp · Main camera image for the hero section"
          />
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white mb-1">Highlights</h2>
          <ArrayEditor
            value={form.highlights}
            onChange={(val) => updateField('highlights', val)}
            label="Highlight badges shown below the hero image"
            placeholder="Add a highlight..."
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-black font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

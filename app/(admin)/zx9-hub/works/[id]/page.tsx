'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  Save,
  Loader2,
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  Video,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ImageUploader from '@/components/admin/ImageUploader';
import ArrayEditor from '@/components/admin/ArrayEditor';
import ColorPicker from '@/components/admin/ColorPicker';

/* ---------- Types ---------- */

interface FormData {
  slug: string;
  category: string;
  clientName: string;
  projectTitle: string;
  year: string;
  accentColor: string;
  thumbnailImage: string;
  thumbnailAlt: string;
  heroCoverImage: string;
  heroTagline: string;
  heroDescription: string;
  overviewChallenge: string;
  overviewSolution: string;
  overviewApproach: string[];
  overviewDeliverables: string[];
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialRole: string;
  testimonialCompany: string;
  published: boolean;
  relatedSlugs: string[];
}

interface HeroStat {
  id?: string;
  label: string;
  value: string;
  sortOrder: number;
}

interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  alt?: string;
  sortOrder: number;
}

interface ProjectResult {
  id?: string;
  metric: string;
  value: string;
  label: string;
  sortOrder: number;
}

const CATEGORIES = [
  { value: 'brand-identity', label: 'Brand Identity' },
  { value: 'digital-campaigns', label: 'Digital Campaigns' },
  { value: 'video-production', label: 'Video Production' },
  { value: 'event-branding', label: 'Event Branding' },
];

/* ---------- Collapsible Section ---------- */

function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
  icon,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-lg font-semibold text-white font-['Gibson']">
            {title}
          </h2>
        </div>
        {open ? (
          <ChevronDown size={18} className="text-white/40" />
        ) : (
          <ChevronRight size={18} className="text-white/40" />
        )}
      </button>
      {open && <div className="px-6 pb-6 space-y-4">{children}</div>}
    </div>
  );
}

/* ---------- Main Component ---------- */

export default function WorksEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState<FormData>({
    slug: '',
    category: 'brand-identity',
    clientName: '',
    projectTitle: '',
    year: '',
    accentColor: '#00e92c',
    thumbnailImage: '',
    thumbnailAlt: '',
    heroCoverImage: '',
    heroTagline: '',
    heroDescription: '',
    overviewChallenge: '',
    overviewSolution: '',
    overviewApproach: [],
    overviewDeliverables: [],
    testimonialQuote: '',
    testimonialAuthor: '',
    testimonialRole: '',
    testimonialCompany: '',
    published: true,
    relatedSlugs: [],
  });

  const [heroStats, setHeroStats] = useState<HeroStat[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [results, setResults] = useState<ProjectResult[]>([]);

  const [newGalleryType, setNewGalleryType] = useState<'image' | 'video'>('image');
  const [newGallerySrc, setNewGallerySrc] = useState('');
  const [newGalleryAlt, setNewGalleryAlt] = useState('');
  const [addingGallery, setAddingGallery] = useState(false);

  const [savingStats, setSavingStats] = useState(false);
  const [savingResults, setSavingResults] = useState(false);

  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/works/${id}`);
      if (!res.ok) throw new Error('Failed to load project');
      const data = await res.json();

      setForm({
        slug: data.slug || '',
        category: data.category || 'brand-identity',
        clientName: data.clientName || '',
        projectTitle: data.projectTitle || '',
        year: data.year || '',
        accentColor: data.accentColor || '#00e92c',
        thumbnailImage: data.thumbnailImage || '',
        thumbnailAlt: data.thumbnailAlt || '',
        heroCoverImage: data.heroCoverImage || '',
        heroTagline: data.heroTagline || '',
        heroDescription: data.heroDescription || '',
        overviewChallenge: data.overviewChallenge || '',
        overviewSolution: data.overviewSolution || '',
        overviewApproach: data.overviewApproach || [],
        overviewDeliverables: data.overviewDeliverables || [],
        testimonialQuote: data.testimonialQuote || '',
        testimonialAuthor: data.testimonialAuthor || '',
        testimonialRole: data.testimonialRole || '',
        testimonialCompany: data.testimonialCompany || '',
        published: data.published ?? true,
        relatedSlugs: data.relatedSlugs || [],
      });

      setHeroStats(
        (data.heroStats || []).map((s: HeroStat) => ({
          label: s.label,
          value: s.value,
          sortOrder: s.sortOrder ?? 0,
        }))
      );

      setGalleryItems(data.galleryItems || []);

      setResults(
        (data.results || []).map((r: ProjectResult) => ({
          metric: r.metric,
          value: r.value,
          label: r.label,
          sortOrder: r.sortOrder ?? 0,
        }))
      );
    } catch {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function showSuccess(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  }

  /* ---- Save main form ---- */
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/works/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          typeof data.error === 'string' ? data.error : 'Failed to save'
        );
      }

      showSuccess('Project saved successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  /* ---- Hero Stats ---- */
  function addStat() {
    setHeroStats((prev) => [
      ...prev,
      { label: '', value: '', sortOrder: prev.length },
    ]);
  }

  function updateStat(index: number, field: 'label' | 'value', val: string) {
    setHeroStats((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: val } : s))
    );
  }

  function removeStat(index: number) {
    setHeroStats((prev) => prev.filter((_, i) => i !== index));
  }

  async function saveStats() {
    setSavingStats(true);
    try {
      const payload = heroStats.map((s, i) => ({
        label: s.label,
        value: s.value,
        sortOrder: i,
      }));
      const res = await fetch(`/api/admin/works/${id}/stats`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save stats');
      showSuccess('Stats saved');
    } catch {
      setError('Failed to save stats');
    } finally {
      setSavingStats(false);
    }
  }

  /* ---- Gallery ---- */
  async function addGalleryItem() {
    if (!newGallerySrc.trim()) return;
    setAddingGallery(true);
    try {
      const res = await fetch(`/api/admin/works/${id}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newGalleryType,
          src: newGallerySrc,
          alt: newGalleryAlt || undefined,
          sortOrder: galleryItems.length,
        }),
      });
      if (!res.ok) throw new Error('Failed to add gallery item');
      const item = await res.json();
      setGalleryItems((prev) => [...prev, item]);
      setNewGallerySrc('');
      setNewGalleryAlt('');
      showSuccess('Gallery item added');
    } catch {
      setError('Failed to add gallery item');
    } finally {
      setAddingGallery(false);
    }
  }

  async function deleteGalleryItem(itemId: string) {
    if (!confirm('Delete this gallery item?')) return;
    try {
      const res = await fetch(`/api/admin/works/${id}/gallery/${itemId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      setGalleryItems((prev) => prev.filter((g) => g.id !== itemId));
    } catch {
      setError('Failed to delete gallery item');
    }
  }

  /* ---- Results ---- */
  function addResult() {
    setResults((prev) => [
      ...prev,
      { metric: '', value: '', label: '', sortOrder: prev.length },
    ]);
  }

  function updateResult(
    index: number,
    field: 'metric' | 'value' | 'label',
    val: string
  ) {
    setResults((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: val } : r))
    );
  }

  function removeResult(index: number) {
    setResults((prev) => prev.filter((_, i) => i !== index));
  }

  async function saveResults() {
    setSavingResults(true);
    try {
      const payload = results.map((r, i) => ({
        metric: r.metric,
        value: r.value,
        label: r.label,
        sortOrder: i,
      }));
      const res = await fetch(`/api/admin/works/${id}/results`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save results');
      showSuccess('Results saved');
    } catch {
      setError('Failed to save results');
    } finally {
      setSavingResults(false);
    }
  }

  /* ---------- Render ---------- */

  const inputClasses =
    'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50 transition-colors';
  const labelClasses = 'block text-sm font-medium text-white/70 mb-2';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={32} className="text-[#00e92c] animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/zx9-hub/works"
            className="p-2 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors"
          >
            <ArrowLeft size={18} className="text-white/60" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white font-['Gibson']">
              Edit Project
            </h1>
            <p className="text-white/50 text-sm mt-1">
              {form.projectTitle || 'Untitled'}
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push(`/works/${form.slug}`)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/60 text-sm hover:border-white/20 transition-colors"
        >
          View Live
        </button>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 px-4 py-3 bg-[#00e92c]/10 border border-[#00e92c]/30 rounded-xl text-[#00e92c] text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <CollapsibleSection title="Basic Info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Project Title *</label>
              <input
                type="text"
                value={form.projectTitle}
                onChange={(e) => updateField('projectTitle', e.target.value)}
                placeholder="My Awesome Project"
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className={labelClasses}>Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                placeholder="my-awesome-project"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Category *</label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                className={inputClasses}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-[#0a0a0a]">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Client Name *</label>
              <input
                type="text"
                value={form.clientName}
                onChange={(e) => updateField('clientName', e.target.value)}
                placeholder="Client Co."
                className={inputClasses}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Year *</label>
              <input
                type="text"
                value={form.year}
                onChange={(e) => updateField('year', e.target.value)}
                placeholder="2025"
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className={labelClasses}>Accent Color</label>
              <ColorPicker
                value={form.accentColor}
                onChange={(color) => updateField('accentColor', color)}
              />
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Thumbnail">
          <ImageUploader
            value={form.thumbnailImage}
            onChange={(url) => updateField('thumbnailImage', url)}
            label="Thumbnail Image *"
            hint="160×120px · webp · /public/images/works/[slug]/filename.webp"
          />
          <div>
            <label className={labelClasses}>Alt Text *</label>
            <input
              type="text"
              value={form.thumbnailAlt}
              onChange={(e) => updateField('thumbnailAlt', e.target.value)}
              placeholder="Brief description of the thumbnail"
              className={inputClasses}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Hero">
          <ImageUploader
            value={form.heroCoverImage}
            onChange={(url) => updateField('heroCoverImage', url)}
            label="Hero Cover Image *"
            hint="600×400px · webp · /public/images/works/[slug]/filename.webp"
          />
          <div>
            <label className={labelClasses}>Hero Tagline *</label>
            <input
              type="text"
              value={form.heroTagline}
              onChange={(e) => updateField('heroTagline', e.target.value)}
              placeholder="A catchy tagline"
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Hero Description *</label>
            <textarea
              value={form.heroDescription}
              onChange={(e) => updateField('heroDescription', e.target.value)}
              placeholder="Describe the project..."
              rows={4}
              className={inputClasses}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Overview">
          <div>
            <label className={labelClasses}>Challenge *</label>
            <textarea
              value={form.overviewChallenge}
              onChange={(e) => updateField('overviewChallenge', e.target.value)}
              placeholder="What problem needed to be solved?"
              rows={3}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Solution *</label>
            <textarea
              value={form.overviewSolution}
              onChange={(e) => updateField('overviewSolution', e.target.value)}
              placeholder="How was the problem solved?"
              rows={3}
              className={inputClasses}
            />
          </div>
          <ArrayEditor
            value={form.overviewApproach}
            onChange={(val) => updateField('overviewApproach', val)}
            label="Approach"
            placeholder="Add approach step..."
          />
          <ArrayEditor
            value={form.overviewDeliverables}
            onChange={(val) => updateField('overviewDeliverables', val)}
            label="Deliverables"
            placeholder="Add deliverable..."
          />
        </CollapsibleSection>

        <CollapsibleSection title="Testimonial" defaultOpen={false}>
          <div>
            <label className={labelClasses}>Quote *</label>
            <textarea
              value={form.testimonialQuote}
              onChange={(e) => updateField('testimonialQuote', e.target.value)}
              placeholder="What the client said..."
              rows={3}
              className={inputClasses}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClasses}>Author *</label>
              <input
                type="text"
                value={form.testimonialAuthor}
                onChange={(e) =>
                  updateField('testimonialAuthor', e.target.value)
                }
                placeholder="John Doe"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Role *</label>
              <input
                type="text"
                value={form.testimonialRole}
                onChange={(e) => updateField('testimonialRole', e.target.value)}
                placeholder="CEO"
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Company *</label>
              <input
                type="text"
                value={form.testimonialCompany}
                onChange={(e) =>
                  updateField('testimonialCompany', e.target.value)
                }
                placeholder="Acme Inc."
                className={inputClasses}
              />
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Settings" defaultOpen={false}>
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
            <div>
              <p className="text-sm font-medium text-white">Published</p>
              <p className="text-xs text-white/40 mt-0.5">
                Make this project visible on the public site
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateField('published', !form.published)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                form.published ? 'bg-[#00e92c]' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.published ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <ArrayEditor
            value={form.relatedSlugs}
            onChange={(val) => updateField('relatedSlugs', val)}
            label="Related Project Slugs"
            placeholder="Add related slug..."
          />
        </CollapsibleSection>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-[#050505] font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? 'Saving...' : 'Save Project'}
          </button>
          <Link
            href="/zx9-hub/works"
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 text-sm hover:border-white/20 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>

      <div className="my-10 border-t border-white/10" />

      <CollapsibleSection
        title="Hero Stats"
        defaultOpen={false}
        icon={<BarChart3 size={18} className="text-[#00ffff]" />}
      >
        <div className="space-y-3">
          {heroStats.map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl"
            >
              <input
                type="text"
                value={stat.label}
                onChange={(e) => updateStat(i, 'label', e.target.value)}
                placeholder="Label (e.g. Impressions)"
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50"
              />
              <input
                type="text"
                value={stat.value}
                onChange={(e) => updateStat(i, 'value', e.target.value)}
                placeholder="Value (e.g. 2.5M)"
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50"
              />
              <button
                type="button"
                onClick={() => removeStat(i)}
                className="p-2 text-white/30 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={addStat}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 hover:border-white/20 transition-colors"
            >
              <Plus size={14} />
              Add Stat
            </button>
            <button
              type="button"
              onClick={saveStats}
              disabled={savingStats}
              className="flex items-center gap-2 px-4 py-2 bg-[#00ffff]/10 border border-[#00ffff]/30 rounded-xl text-sm text-[#00ffff] hover:bg-[#00ffff]/20 transition-colors disabled:opacity-50"
            >
              {savingStats ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Save Stats
            </button>
          </div>
        </div>
      </CollapsibleSection>

      <div className="mt-6">
        <CollapsibleSection
          title="Gallery"
          defaultOpen={false}
          icon={<ImageIcon size={18} className="text-[#00e92c]" />}
        >
          {galleryItems.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="relative group bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                >
                  {item.type === 'image' ? (
                    <div className="relative h-32">
                      <Image
                        src={item.src}
                        alt={item.alt || ''}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 bg-white/5">
                      <Video size={24} className="text-white/30" />
                    </div>
                  )}
                  <div className="p-2 flex items-center justify-between">
                    <span className="text-xs text-white/40 uppercase">
                      {item.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteGalleryItem(item.id)}
                      className="p-1 text-white/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {galleryItems.length === 0 && (
            <p className="text-white/30 text-sm mb-4">
              No gallery items yet. Add your first one below.
            </p>
          )}

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
            <p className="text-sm font-medium text-white/70">
              Add Gallery Item
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/50 mb-1">Type</label>
                <select
                  value={newGalleryType}
                  onChange={(e) =>
                    setNewGalleryType(e.target.value as 'image' | 'video')
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#00e92c]/50"
                >
                  <option value="image" className="bg-[#0a0a0a]">
                    Image
                  </option>
                  <option value="video" className="bg-[#0a0a0a]">
                    Video
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={newGalleryAlt}
                  onChange={(e) => setNewGalleryAlt(e.target.value)}
                  placeholder="Description"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50"
                />
              </div>
            </div>

            {newGalleryType === 'image' ? (
              <ImageUploader
                value={newGallerySrc}
                onChange={setNewGallerySrc}
                label="Image"
              />
            ) : (
              <div>
                <label className="block text-xs text-white/50 mb-1">
                  Video URL
                </label>
                <input
                  type="text"
                  value={newGallerySrc}
                  onChange={(e) => setNewGallerySrc(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50"
                />
              </div>
            )}

            <button
              type="button"
              onClick={addGalleryItem}
              disabled={addingGallery || !newGallerySrc.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-[#00e92c]/10 border border-[#00e92c]/30 rounded-xl text-sm text-[#00e92c] hover:bg-[#00e92c]/20 transition-colors disabled:opacity-50"
            >
              {addingGallery ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Plus size={14} />
              )}
              Add Gallery Item
            </button>
          </div>
        </CollapsibleSection>
      </div>

      <div className="mt-6 mb-10">
        <CollapsibleSection
          title="Results"
          defaultOpen={false}
          icon={<TrendingUp size={18} className="text-[#00e92c]" />}
        >
          <div className="space-y-3">
            {results.map((result, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl"
              >
                <input
                  type="text"
                  value={result.metric}
                  onChange={(e) => updateResult(i, 'metric', e.target.value)}
                  placeholder="Metric (e.g. ROI)"
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50"
                />
                <input
                  type="text"
                  value={result.value}
                  onChange={(e) => updateResult(i, 'value', e.target.value)}
                  placeholder="Value (e.g. 340%)"
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50"
                />
                <input
                  type="text"
                  value={result.label}
                  onChange={(e) => updateResult(i, 'label', e.target.value)}
                  placeholder="Label (e.g. Return on Investment)"
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50"
                />
                <button
                  type="button"
                  onClick={() => removeResult(i)}
                  className="p-2 text-white/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={addResult}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 hover:border-white/20 transition-colors"
              >
                <Plus size={14} />
                Add Result
              </button>
              <button
                type="button"
                onClick={saveResults}
                disabled={savingResults}
                className="flex items-center gap-2 px-4 py-2 bg-[#00e92c]/10 border border-[#00e92c]/30 rounded-xl text-sm text-[#00e92c] hover:bg-[#00e92c]/20 transition-colors disabled:opacity-50"
              >
                {savingResults ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Save Results
              </button>
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}

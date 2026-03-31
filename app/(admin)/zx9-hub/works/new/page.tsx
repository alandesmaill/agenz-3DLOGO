'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  Save,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '@/components/admin/ImageUploader';
import ArrayEditor from '@/components/admin/ArrayEditor';
import ColorPicker from '@/components/admin/ColorPicker';

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

const INITIAL_DATA: FormData = {
  slug: '',
  category: 'brand-identity',
  clientName: '',
  projectTitle: '',
  year: new Date().getFullYear().toString(),
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
};

const CATEGORIES = [
  { value: 'brand-identity', label: 'Brand Identity' },
  { value: 'digital-campaigns', label: 'Digital Campaigns' },
  { value: 'video-production', label: 'Video Production' },
  { value: 'event-branding', label: 'Event Branding' },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <h2 className="text-lg font-semibold text-white font-['Gibson']">
          {title}
        </h2>
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

export default function WorksNewPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL_DATA);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'projectTitle' && typeof value === 'string') {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/works', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          typeof data.error === 'string'
            ? data.error
            : 'Failed to create project'
        );
      }

      const project = await res.json();
      router.push(`/zx9-hub/works/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  const inputClasses =
    'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50 transition-colors';
  const labelClasses = 'block text-sm font-medium text-white/70 mb-2';

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/zx9-hub/works"
          className="p-2 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors"
        >
          <ArrowLeft size={18} className="text-white/60" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white font-['Gibson']">
            New Project
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Create a new portfolio project
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
              <p className="text-xs text-white/30 mt-1">
                Auto-generated from title. Edit to customize.
              </p>
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
                onChange={(e) => updateField('testimonialAuthor', e.target.value)}
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

        <div className="flex items-center gap-4 pt-4">
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
            {saving ? 'Creating...' : 'Create Project'}
          </button>
          <Link
            href="/zx9-hub/works"
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 text-sm hover:border-white/20 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

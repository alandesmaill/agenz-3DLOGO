'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  Save,
  Loader2,
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
} from 'lucide-react';
import Link from 'next/link';
import ArrayEditor from '@/components/admin/ArrayEditor';
import ColorPicker from '@/components/admin/ColorPicker';
import IconSelector from '@/components/admin/IconSelector';

/* ---------- Types ---------- */

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
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  sortOrder: number;
  published: boolean;
}

interface Feature {
  id?: string;
  iconName: string;
  title: string;
  description: string;
  sortOrder: number;
}

const INITIAL_FORM: FormData = {
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
  ctaButtonText: '',
  ctaButtonLink: '/contact',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: [],
  sortOrder: 0,
  published: true,
};

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
          <span className="text-white font-semibold">{title}</span>
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

/* ---------- Field Helpers ---------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-2">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50 transition-colors';
const textareaClass = `${inputClass} min-h-[100px] resize-y`;

/* ---------- Page ---------- */

export default function ServiceEditPage() {
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingFeatures, setSavingFeatures] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadService = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/services/${id}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setForm({
        slug: data.slug || '',
        number: data.number || '',
        title: data.title || '',
        accentColor: data.accentColor || '#00ffff',
        overviewDescription: data.overviewDescription || '',
        overviewIconName: data.overviewIconName || 'Megaphone',
        ctaText: data.ctaText || 'Learn More',
        ctaLink: data.ctaLink || '',
        heroTagline: data.heroTagline || '',
        heroDescription: data.heroDescription || '',
        heroStats: Array.isArray(data.heroStats) ? data.heroStats : [],
        overviewHeading: data.overviewHeading || '',
        overviewParagraphs: data.overviewParagraphs || [],
        overviewBenefits: data.overviewBenefits || [],
        ctaHeading: data.ctaHeading || '',
        ctaDescription: data.ctaDescription || '',
        ctaButtonText: data.ctaButtonText || '',
        ctaButtonLink: data.ctaButtonLink || '/contact',
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        metaKeywords: data.metaKeywords || [],
        sortOrder: data.sortOrder ?? 0,
        published: data.published ?? true,
      });
      setFeatures(
        (data.features || []).map((f: Feature, i: number) => ({
          id: f.id,
          iconName: f.iconName,
          title: f.title,
          description: f.description,
          sortOrder: f.sortOrder ?? i,
        }))
      );
    } catch {
      setError('Failed to load service');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadService();
  }, [loadService]);

  function updateForm(field: keyof FormData, value: FormData[keyof FormData]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const url = `/api/admin/services/${id}`;
      const method = 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(typeof err.error === 'string' ? err.error : 'Failed to save');
      }
      const saved = await res.json();
      setSuccess('Service saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveFeatures() {
    setSavingFeatures(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/services/${id}/features`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          features.map((f, i) => ({
            iconName: f.iconName,
            title: f.title,
            description: f.description,
            sortOrder: i,
          }))
        ),
      });
      if (!res.ok) throw new Error('Failed to save features');
      const saved = await res.json();
      setFeatures(saved);
      setSuccess('Features saved!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save features');
    } finally {
      setSavingFeatures(false);
    }
  }

  function addFeature() {
    setFeatures((prev) => [
      ...prev,
      { iconName: 'Star', title: '', description: '', sortOrder: prev.length },
    ]);
  }

  function removeFeature(index: number) {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  }

  function updateFeature(index: number, field: keyof Feature, value: string | number) {
    setFeatures((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    );
  }

  function addHeroStat() {
    updateForm('heroStats', [...form.heroStats, { value: '', label: '' }]);
  }

  function removeHeroStat(index: number) {
    updateForm('heroStats', form.heroStats.filter((_, i) => i !== index));
  }

  function updateHeroStat(index: number, field: 'value' | 'label', val: string) {
    updateForm(
      'heroStats',
      form.heroStats.map((s, i) => (i === index ? { ...s, [field]: val } : s))
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="text-[#00e92c] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/services"
          className="p-2 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors"
        >
          <ArrowLeft size={18} className="text-white/60" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white font-['Gibson']">
            Edit: {form.title}
          </h1>
          <p className="text-white/50 text-sm mt-1">/{form.slug}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-[#050505] font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Service
        </button>
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

      <div className="space-y-6">
        <CollapsibleSection title="Basic Info">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug">
              <input
                type="text"
                value={form.slug}
                onChange={(e) => updateForm('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="advertising"
                className={inputClass}
              />
            </Field>
            <Field label="Number">
              <input
                type="text"
                value={form.number}
                onChange={(e) => updateForm('number', e.target.value)}
                placeholder="01"
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Title">
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateForm('title', e.target.value)}
              placeholder="Advertising & Social Media"
              className={inputClass}
            />
          </Field>
          <Field label="Accent Color">
            <ColorPicker value={form.accentColor} onChange={(c) => updateForm('accentColor', c)} />
          </Field>
          <Field label="Overview Icon">
            <IconSelector value={form.overviewIconName} onChange={(v) => updateForm('overviewIconName', v)} />
          </Field>
          <Field label="Overview Description (for services grid card)">
            <textarea
              value={form.overviewDescription}
              onChange={(e) => updateForm('overviewDescription', e.target.value)}
              placeholder="Short description for the services overview page..."
              className={textareaClass}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="CTA Text (card button)">
              <input
                type="text"
                value={form.ctaText}
                onChange={(e) => updateForm('ctaText', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="CTA Link (card link)">
              <input
                type="text"
                value={form.ctaLink}
                onChange={(e) => updateForm('ctaLink', e.target.value)}
                placeholder="/services/advertising"
                className={inputClass}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sort Order">
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => updateForm('sortOrder', parseInt(e.target.value) || 0)}
                className={inputClass}
              />
            </Field>
            <Field label="Published">
              <button
                type="button"
                onClick={() => updateForm('published', !form.published)}
                className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  form.published
                    ? 'bg-[#00e92c]/20 border-[#00e92c]/30 text-[#00e92c]'
                    : 'bg-white/5 border-white/10 text-white/50'
                }`}
              >
                {form.published ? 'Published' : 'Draft'}
              </button>
            </Field>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Hero Section">
          <Field label="Tagline">
            <input
              type="text"
              value={form.heroTagline}
              onChange={(e) => updateForm('heroTagline', e.target.value)}
              placeholder="Amplify Your Brand Across Digital Platforms"
              className={inputClass}
            />
          </Field>
          <Field label="Description">
            <textarea
              value={form.heroDescription}
              onChange={(e) => updateForm('heroDescription', e.target.value)}
              placeholder="Hero description text..."
              className={textareaClass}
            />
          </Field>
          <Field label="Hero Stats">
            <div className="space-y-3">
              {form.heroStats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateHeroStat(i, 'value', e.target.value)}
                    placeholder="340%"
                    className={`${inputClass} w-32`}
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateHeroStat(i, 'label', e.target.value)}
                    placeholder="Avg Engagement Growth"
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => removeHeroStat(i)}
                    className="p-2 text-white/40 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addHeroStat}
                className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60 hover:border-white/20 transition-colors"
              >
                <Plus size={14} />
                Add Stat
              </button>
            </div>
          </Field>
        </CollapsibleSection>

        <CollapsibleSection title="Overview Section">
          <Field label="Heading">
            <input
              type="text"
              value={form.overviewHeading}
              onChange={(e) => updateForm('overviewHeading', e.target.value)}
              placeholder="Transforming Social Presence into Business Growth"
              className={inputClass}
            />
          </Field>
          <ArrayEditor
            label="Paragraphs"
            value={form.overviewParagraphs}
            onChange={(v) => updateForm('overviewParagraphs', v)}
            placeholder="Add a paragraph..."
          />
          <ArrayEditor
            label="Benefits"
            value={form.overviewBenefits}
            onChange={(v) => updateForm('overviewBenefits', v)}
            placeholder="Add a benefit..."
          />
        </CollapsibleSection>

        <CollapsibleSection title="CTA Section">
          <Field label="Heading">
            <input
              type="text"
              value={form.ctaHeading}
              onChange={(e) => updateForm('ctaHeading', e.target.value)}
              placeholder="Ready to Amplify Your Brand?"
              className={inputClass}
            />
          </Field>
          <Field label="Description">
            <textarea
              value={form.ctaDescription}
              onChange={(e) => updateForm('ctaDescription', e.target.value)}
              className={textareaClass}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Button Text">
              <input
                type="text"
                value={form.ctaButtonText}
                onChange={(e) => updateForm('ctaButtonText', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Button Link">
              <input
                type="text"
                value={form.ctaButtonLink}
                onChange={(e) => updateForm('ctaButtonLink', e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="SEO" defaultOpen={false}>
          <Field label="Meta Title">
            <input
              type="text"
              value={form.metaTitle}
              onChange={(e) => updateForm('metaTitle', e.target.value)}
              placeholder="Page title for search engines"
              className={inputClass}
            />
          </Field>
          <Field label="Meta Description">
            <textarea
              value={form.metaDescription}
              onChange={(e) => updateForm('metaDescription', e.target.value)}
              placeholder="Page description for search engines"
              className={textareaClass}
            />
          </Field>
          <ArrayEditor
            label="Keywords"
            value={form.metaKeywords}
            onChange={(v) => updateForm('metaKeywords', v)}
            placeholder="Add keyword..."
          />
        </CollapsibleSection>

        <CollapsibleSection title={`Features (${features.length})`}>
            <div className="space-y-4">
              {features.map((feature, i) => (
                <div
                  key={feature.id || i}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical size={16} className="text-white/20 shrink-0" />
                    <span className="text-white/30 text-xs font-mono w-6">#{i + 1}</span>
                    <div className="flex-1">
                      <IconSelector
                        value={feature.iconName}
                        onChange={(v) => updateFeature(i, 'iconName', v)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFeature(i)}
                      className="p-2 text-white/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) => updateFeature(i, 'title', e.target.value)}
                    placeholder="Feature title"
                    className={inputClass}
                  />
                  <textarea
                    value={feature.description}
                    onChange={(e) => updateFeature(i, 'description', e.target.value)}
                    placeholder="Feature description..."
                    className={`${inputClass} min-h-[60px] resize-y`}
                  />
                </div>
              ))}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 hover:border-white/20 transition-colors"
                >
                  <Plus size={16} />
                  Add Feature
                </button>
                <button
                  type="button"
                  onClick={handleSaveFeatures}
                  disabled={savingFeatures}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#00e92c]/20 border border-[#00e92c]/30 rounded-xl text-sm text-[#00e92c] hover:bg-[#00e92c]/30 transition-colors disabled:opacity-50"
                >
                  {savingFeatures ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save Features
                </button>
              </div>
            </div>
          </CollapsibleSection>
      </div>
    </div>
  );
}

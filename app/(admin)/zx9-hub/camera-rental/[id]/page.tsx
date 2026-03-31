'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Pencil,
  X,
  Check,
} from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import ColorPicker from '@/components/admin/ColorPicker';
import ArrayEditor from '@/components/admin/ArrayEditor';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface EquipmentItem {
  id: string;
  name: string;
  brand: string;
  qty: number;
  notes: string;
  image: string;
}

interface EquipmentCategory {
  id: string;
  slug: string;
  name: string;
  iconName: string;
  description: string;
  items: EquipmentItem[];
}

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

const ICON_OPTIONS = [
  'Camera',
  'Aperture',
  'HardDrive',
  'Monitor',
  'Wifi',
  'SlidersHorizontal',
  'Layers',
  'Crosshair',
  'Battery',
  'Square',
  'PersonStanding',
  'Box',
  'Clapperboard',
  'Lightbulb',
  'Mic',
  'Film',
];

const inputClass =
  'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50 transition-colors text-sm';

const smallInputClass =
  'w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50 transition-colors text-xs';

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function CameraRentalEditPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormData>({
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
  });

  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ slug: '', name: '', iconName: 'Camera', description: '' });
  const [addingCategory, setAddingCategory] = useState(false);

  const [addingItemFor, setAddingItemFor] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ name: '', brand: '', qty: 1, notes: '', image: '' });
  const [savingItem, setSavingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editItemData, setEditItemData] = useState({ name: '', brand: '', qty: 1, notes: '', image: '' });
  const [savingEditItem, setSavingEditItem] = useState(false);
  const [deletingItem, setDeletingItem] = useState<string | null>(null);
  const [deletingCat, setDeletingCat] = useState<string | null>(null);

  /* ---------------------------------------------------------------- */
  /*  Data Loading                                                     */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/camera-rental/${packageId}`);
        if (!res.ok) {
          setError('Package not found.');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setForm({
          slug: data.slug || '',
          name: data.name || '',
          tagline: data.tagline || '',
          description: data.description || '',
          cameraBody: data.cameraBody || '',
          accentColor: data.accentColor || '#00e92c',
          packageImage: data.packageImage || '',
          highlights: data.highlights || [],
          productionSetIncludes: data.productionSetIncludes || [],
          published: data.published ?? false,
        });
        setCategories(data.equipmentCategories || []);
      } catch {
        setError('Failed to load package.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [packageId]);

  /* ---------------------------------------------------------------- */
  /*  Helpers                                                          */
  /* ---------------------------------------------------------------- */

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleCat(id: string) {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  /* ---------------------------------------------------------------- */
  /*  Package Save                                                     */
  /* ---------------------------------------------------------------- */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      setError('Name and slug are required.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/camera-rental/${packageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/zx9-hub/camera-rental');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to save package.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Category CRUD                                                    */
  /* ---------------------------------------------------------------- */

  async function handleAddCategory() {
    if (!newCategory.name.trim()) return;
    setAddingCategory(true);
    try {
      const slug =
        newCategory.slug.trim() ||
        newCategory.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');
      const res = await fetch(`/api/admin/camera-rental/${packageId}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCategory, slug }),
      });
      if (res.ok) {
        const cat = await res.json();
        setCategories((prev) => [...prev, { ...cat, items: cat.items || [] }]);
        setNewCategory({ slug: '', name: '', iconName: 'Camera', description: '' });
        setShowNewCategory(false);
      }
    } catch {
    } finally {
      setAddingCategory(false);
    }
  }

  async function handleDeleteCategory(catId: string) {
    if (!confirm('Delete this category and all its items?')) return;
    setDeletingCat(catId);
    try {
      const res = await fetch(`/api/admin/camera-rental/${packageId}/categories/${catId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== catId));
      }
    } catch {
    } finally {
      setDeletingCat(null);
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Item CRUD                                                        */
  /* ---------------------------------------------------------------- */

  async function handleAddItem(catId: string) {
    if (!newItem.name.trim()) return;
    setSavingItem(true);
    try {
      const res = await fetch(
        `/api/admin/camera-rental/${packageId}/categories/${catId}/items`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        }
      );
      if (res.ok) {
        const item = await res.json();
        setCategories((prev) =>
          prev.map((c) => (c.id === catId ? { ...c, items: [...c.items, item] } : c))
        );
        setNewItem({ name: '', brand: '', qty: 1, notes: '', image: '' });
        setAddingItemFor(null);
      }
    } catch {
    } finally {
      setSavingItem(false);
    }
  }

  async function handleEditItem(catId: string, itemId: string) {
    if (!editItemData.name.trim()) return;
    setSavingEditItem(true);
    try {
      const res = await fetch(
        `/api/admin/camera-rental/${packageId}/categories/${catId}/items/${itemId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editItemData),
        }
      );
      if (res.ok) {
        const updated = await res.json();
        setCategories((prev) =>
          prev.map((c) =>
            c.id === catId
              ? { ...c, items: c.items.map((i) => (i.id === itemId ? updated : i)) }
              : c
          )
        );
        setEditingItem(null);
      }
    } catch {
    } finally {
      setSavingEditItem(false);
    }
  }

  async function handleDeleteItem(catId: string, itemId: string) {
    if (!confirm('Delete this item?')) return;
    setDeletingItem(itemId);
    try {
      const res = await fetch(
        `/api/admin/camera-rental/${packageId}/categories/${catId}/items/${itemId}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === catId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c
          )
        );
      }
    } catch {
    } finally {
      setDeletingItem(null);
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="text-[#00e92c] animate-spin" />
      </div>
    );
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
          <h1 className="text-2xl font-bold text-white font-['Gibson']">Edit Package</h1>
          <p className="text-white/50 text-sm mt-1">{form.name || 'Untitled'}</p>
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
                placeholder="cinema-pro-kit"
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
              placeholder="Short tagline"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Full description..."
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
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href="/zx9-hub/camera-rental"
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/20 transition-colors text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>

      <div className="mt-12 mb-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white font-['Gibson']">Equipment Categories</h2>
          <button
            type="button"
            onClick={() => setShowNewCategory(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#00ffff]/10 border border-[#00ffff]/20 rounded-xl text-[#00ffff] text-sm hover:bg-[#00ffff]/20 transition-colors"
          >
            <Plus size={14} />
            Add Category
          </button>
        </div>

        {showNewCategory && (
          <div className="backdrop-blur-xl bg-white/5 border border-[#00ffff]/20 rounded-2xl p-5 mb-4 space-y-4">
            <h3 className="text-sm font-semibold text-[#00ffff]">New Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Name *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Lenses"
                  className={smallInputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Slug</label>
                <input
                  type="text"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="auto-from-name"
                  className={smallInputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Icon</label>
                <select
                  value={newCategory.iconName}
                  onChange={(e) => setNewCategory((p) => ({ ...p, iconName: e.target.value }))}
                  className={`${smallInputClass} appearance-none`}
                >
                  {ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon} className="bg-[#111] text-white">
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Description</label>
                <input
                  type="text"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Optional description"
                  className={smallInputClass}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={addingCategory}
                className="flex items-center gap-2 px-4 py-2 bg-[#00ffff]/20 border border-[#00ffff]/30 rounded-lg text-[#00ffff] text-xs hover:bg-[#00ffff]/30 transition-colors disabled:opacity-50"
              >
                {addingCategory ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowNewCategory(false)}
                className="px-4 py-2 text-xs text-white/40 hover:text-white/60 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {categories.length === 0 && !showNewCategory ? (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-white/40 text-sm">No equipment categories yet. Add one above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => {
              const isExpanded = expandedCats.has(cat.id);
              return (
                <div
                  key={cat.id}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-4">
                    <button
                      type="button"
                      onClick={() => toggleCat(cat.id)}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-sm">{cat.name}</span>
                        <span className="text-white/30 text-xs">({cat.iconName})</span>
                      </div>
                      <span className="text-white/40 text-xs">
                        {cat.items.length} item{cat.items.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id)}
                      disabled={deletingCat === cat.id}
                      className="p-2 text-white/30 hover:text-red-400 transition-colors"
                    >
                      {deletingCat === cat.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-white/5 p-4 space-y-2">
                      {cat.items.map((item) => (
                        <div key={item.id}>
                          {editingItem === item.id ? (
                            /* Inline edit form */
                            <div className="bg-white/5 border border-[#00e92c]/20 rounded-xl p-3 space-y-3">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <input
                                  type="text"
                                  value={editItemData.name}
                                  onChange={(e) =>
                                    setEditItemData((p) => ({ ...p, name: e.target.value }))
                                  }
                                  placeholder="Name"
                                  className={smallInputClass}
                                />
                                <input
                                  type="text"
                                  value={editItemData.brand}
                                  onChange={(e) =>
                                    setEditItemData((p) => ({ ...p, brand: e.target.value }))
                                  }
                                  placeholder="Brand"
                                  className={smallInputClass}
                                />
                                <input
                                  type="number"
                                  value={editItemData.qty}
                                  onChange={(e) =>
                                    setEditItemData((p) => ({
                                      ...p,
                                      qty: parseInt(e.target.value) || 1,
                                    }))
                                  }
                                  placeholder="Qty"
                                  min={1}
                                  className={smallInputClass}
                                />
                                <input
                                  type="text"
                                  value={editItemData.notes}
                                  onChange={(e) =>
                                    setEditItemData((p) => ({ ...p, notes: e.target.value }))
                                  }
                                  placeholder="Notes"
                                  className={smallInputClass}
                                />
                              </div>
                              <input
                                type="text"
                                value={editItemData.image}
                                onChange={(e) =>
                                  setEditItemData((p) => ({ ...p, image: e.target.value }))
                                }
                                placeholder="Image URL"
                                className={smallInputClass}
                              />
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEditItem(cat.id, item.id)}
                                  disabled={savingEditItem}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-[#00e92c]/20 border border-[#00e92c]/30 rounded-lg text-[#00e92c] text-xs hover:bg-[#00e92c]/30 transition-colors disabled:opacity-50"
                                >
                                  {savingEditItem ? (
                                    <Loader2 size={10} className="animate-spin" />
                                  ) : (
                                    <Check size={10} />
                                  )}
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingItem(null)}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-white/40 hover:text-white/60 transition-colors"
                                >
                                  <X size={10} />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Item display row */
                            <div className="flex items-center gap-3 bg-white/[0.02] rounded-xl px-3 py-2.5 group">
                              {item.image && (
                                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 shrink-0">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <span className="text-white text-xs font-medium">{item.name}</span>
                                <div className="flex items-center gap-2 text-white/30 text-[10px]">
                                  {item.brand && <span>{item.brand}</span>}
                                  <span>Qty: {item.qty}</span>
                                  {item.notes && <span>- {item.notes}</span>}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingItem(item.id);
                                    setEditItemData({
                                      name: item.name,
                                      brand: item.brand,
                                      qty: item.qty,
                                      notes: item.notes,
                                      image: item.image,
                                    });
                                  }}
                                  className="p-1.5 text-white/30 hover:text-[#00ffff] transition-colors"
                                >
                                  <Pencil size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem(cat.id, item.id)}
                                  disabled={deletingItem === item.id}
                                  className="p-1.5 text-white/30 hover:text-red-400 transition-colors"
                                >
                                  {deletingItem === item.id ? (
                                    <Loader2 size={12} className="animate-spin" />
                                  ) : (
                                    <Trash2 size={12} />
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {addingItemFor === cat.id ? (
                        <div className="bg-white/5 border border-[#00ffff]/20 rounded-xl p-3 space-y-3 mt-2">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <input
                              type="text"
                              value={newItem.name}
                              onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
                              placeholder="Name *"
                              className={smallInputClass}
                            />
                            <input
                              type="text"
                              value={newItem.brand}
                              onChange={(e) => setNewItem((p) => ({ ...p, brand: e.target.value }))}
                              placeholder="Brand"
                              className={smallInputClass}
                            />
                            <input
                              type="number"
                              value={newItem.qty}
                              onChange={(e) =>
                                setNewItem((p) => ({
                                  ...p,
                                  qty: parseInt(e.target.value) || 1,
                                }))
                              }
                              placeholder="Qty"
                              min={1}
                              className={smallInputClass}
                            />
                            <input
                              type="text"
                              value={newItem.notes}
                              onChange={(e) => setNewItem((p) => ({ ...p, notes: e.target.value }))}
                              placeholder="Notes"
                              className={smallInputClass}
                            />
                          </div>
                          <input
                            type="text"
                            value={newItem.image}
                            onChange={(e) => setNewItem((p) => ({ ...p, image: e.target.value }))}
                            placeholder="Image URL"
                            className={smallInputClass}
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleAddItem(cat.id)}
                              disabled={savingItem}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#00ffff]/20 border border-[#00ffff]/30 rounded-lg text-[#00ffff] text-xs hover:bg-[#00ffff]/30 transition-colors disabled:opacity-50"
                            >
                              {savingItem ? (
                                <Loader2 size={10} className="animate-spin" />
                              ) : (
                                <Plus size={10} />
                              )}
                              Add Item
                            </button>
                            <button
                              type="button"
                              onClick={() => setAddingItemFor(null)}
                              className="px-3 py-1.5 text-xs text-white/40 hover:text-white/60 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setAddingItemFor(cat.id);
                            setNewItem({ name: '', brand: '', qty: 1, notes: '', image: '' });
                          }}
                          className="flex items-center gap-1.5 mt-2 text-xs text-white/30 hover:text-[#00ffff] transition-colors"
                        >
                          <Plus size={12} />
                          Add Item
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

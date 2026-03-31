'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Camera, Loader2, Package } from 'lucide-react';

interface CameraPackage {
  id: string;
  name: string;
  slug: string;
  published: boolean;
  _count?: {
    categories: number;
  };
}

export default function CameraRentalListPage() {
  const [packages, setPackages] = useState<CameraPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  async function fetchPackages() {
    try {
      const res = await fetch('/api/admin/camera-rental');
      if (res.ok) {
        const data = await res.json();
        setPackages(Array.isArray(data) ? data : []);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPackages();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/camera-rental/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPackages((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
    } finally {
      setDeleting(null);
    }
  }

  async function handleTogglePublished(pkg: CameraPackage) {
    setToggling(pkg.id);
    try {
      const res = await fetch(`/api/admin/camera-rental/${pkg.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !pkg.published }),
      });
      if (res.ok) {
        setPackages((prev) =>
          prev.map((p) => (p.id === pkg.id ? { ...p, published: !p.published } : p))
        );
      }
    } catch {
    } finally {
      setToggling(null);
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Gibson']">Camera Rental Packages</h1>
          <p className="text-white/50 text-sm mt-1">
            Manage equipment rental packages
          </p>
        </div>
        <Link
          href="/zx9-hub/camera-rental/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-black font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm"
        >
          <Plus size={16} />
          New Package
        </Link>
      </div>

      {packages.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <div className="inline-flex p-4 bg-white/5 rounded-2xl mb-4">
            <Package size={32} className="text-white/30" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No packages yet</h3>
          <p className="text-white/40 text-sm mb-6">
            Create your first camera rental package to get started.
          </p>
          <Link
            href="/zx9-hub/camera-rental/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-black font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            <Plus size={16} />
            Create Package
          </Link>
        </div>
      ) : (
        /* Package List */
        <div className="space-y-3">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-white/20 transition-all"
            >
              <div className="p-3 bg-[#00ffff]/10 rounded-xl shrink-0">
                <Camera size={20} className="text-[#00ffff]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-semibold truncate">{pkg.name}</h3>
                  <button
                    type="button"
                    onClick={() => handleTogglePublished(pkg)}
                    disabled={toggling === pkg.id}
                    className={`shrink-0 px-2.5 py-0.5 text-xs font-medium rounded-full border transition-colors ${
                      pkg.published
                        ? 'bg-[#00e92c]/15 text-[#00e92c] border-[#00e92c]/30 hover:bg-[#00e92c]/25'
                        : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {toggling === pkg.id ? (
                      <Loader2 size={10} className="animate-spin inline" />
                    ) : pkg.published ? (
                      'Published'
                    ) : (
                      'Draft'
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span>/{pkg.slug}</span>
                  <span>{pkg._count?.categories ?? 0} categories</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/camera-rental/${pkg.id}`}
                  className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-[#00ffff] hover:border-[#00ffff]/30 transition-colors"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(pkg.id, pkg.name)}
                  disabled={deleting === pkg.id}
                  className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-red-400 hover:border-red-400/30 transition-colors disabled:opacity-50"
                >
                  {deleting === pkg.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

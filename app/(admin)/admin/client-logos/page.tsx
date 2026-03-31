'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ClientLogo {
  id: string;
  name: string;
  image: string;
  sortOrder: number;
  published: boolean;
}

export default function ClientLogosListPage() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  async function fetchLogos() {
    try {
      const res = await fetch('/api/admin/client-logos');
      if (res.ok) {
        const data = await res.json();
        setLogos(Array.isArray(data) ? data : []);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogos();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/client-logos/${id}`, { method: 'DELETE' });
      if (res.ok) setLogos((prev) => prev.filter((l) => l.id !== id));
    } catch {
    } finally {
      setDeleting(null);
    }
  }

  async function handleTogglePublished(logo: ClientLogo) {
    setToggling(logo.id);
    try {
      const res = await fetch(`/api/admin/client-logos/${logo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !logo.published }),
      });
      if (res.ok) {
        setLogos((prev) =>
          prev.map((l) => (l.id === logo.id ? { ...l, published: !l.published } : l))
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
          <h1 className="text-2xl font-bold text-white font-['Gibson']">Client Logos</h1>
          <p className="text-white/50 text-sm mt-1">
            Logos shown in the "Trusted By" section on the website
          </p>
        </div>
        <Link
          href="/admin/client-logos/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-black font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm"
        >
          <Plus size={16} />
          Add Logo
        </Link>
      </div>

      {logos.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <div className="inline-flex p-4 bg-white/5 rounded-2xl mb-4">
            <ImageIcon size={32} className="text-white/30" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No logos yet</h3>
          <p className="text-white/40 text-sm mb-6">
            Add your first client logo to display it in the Trusted By section.
          </p>
          <Link
            href="/admin/client-logos/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-black font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            <Plus size={16} />
            Add Logo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {logos.map((logo) => (
            <div
              key={logo.id}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all group"
            >
              <div className="relative aspect-square bg-white/3 flex items-center justify-center p-6">
                {logo.image ? (
                  <Image
                    src={logo.image}
                    alt={logo.name}
                    fill
                    className="object-contain p-5 [filter:brightness(0)_invert(1)]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <ImageIcon size={32} className="text-white/20" />
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white text-sm font-medium truncate">{logo.name}</p>
                  <button
                    type="button"
                    onClick={() => handleTogglePublished(logo)}
                    disabled={toggling === logo.id}
                    className={`shrink-0 ml-2 px-2 py-0.5 text-xs font-medium rounded-full border transition-colors ${
                      logo.published
                        ? 'bg-[#00e92c]/15 text-[#00e92c] border-[#00e92c]/30 hover:bg-[#00e92c]/25'
                        : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {toggling === logo.id ? (
                      <Loader2 size={10} className="animate-spin inline" />
                    ) : logo.published ? (
                      'Live'
                    ) : (
                      'Hidden'
                    )}
                  </button>
                </div>
                <p className="text-white/40 text-xs mb-3">Order: {logo.sortOrder}</p>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/client-logos/${logo.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-[#00ffff] hover:border-[#00ffff]/30 transition-colors text-xs"
                  >
                    <Pencil size={12} />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(logo.id, logo.name)}
                    disabled={deleting === logo.id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-red-400 hover:border-red-400/30 transition-colors text-xs disabled:opacity-50"
                  >
                    {deleting === logo.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

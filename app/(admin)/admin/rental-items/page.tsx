'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Package, Loader2 } from 'lucide-react';

interface RentalItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string | null;
  available: boolean;
  sortOrder: number;
}

export default function RentalItemsListPage() {
  const [items, setItems] = useState<RentalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  async function fetchItems() {
    try {
      const res = await fetch('/api/admin/rental-items');
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/rental-items/${id}`, { method: 'DELETE' });
      if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
    } finally {
      setDeleting(null);
    }
  }

  async function handleToggleAvailable(item: RentalItem) {
    setToggling(item.id);
    try {
      const res = await fetch(`/api/admin/rental-items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !item.available }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, available: !i.available } : i))
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

  const grouped = items.reduce<Record<string, RentalItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Gibson']">Individual Rental Items</h1>
          <p className="text-white/50 text-sm mt-1">
            Standalone gear available for individual rental
          </p>
        </div>
        <Link
          href="/admin/rental-items/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-black font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm"
        >
          <Plus size={16} />
          Add Item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <div className="inline-flex p-4 bg-white/5 rounded-2xl mb-4">
            <Package size={32} className="text-white/30" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No items yet</h3>
          <p className="text-white/40 text-sm mb-6">
            Add individual rental items to show them on the camera rental page.
          </p>
          <Link
            href="/admin/rental-items/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-black font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            <Plus size={16} />
            Add Item
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3 px-1">
                {category}
                <span className="ml-2 text-white/30 font-normal normal-case tracking-normal">
                  ({grouped[category].length} {grouped[category].length === 1 ? 'item' : 'items'})
                </span>
              </h2>
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                {grouped[category].map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 p-4 hover:bg-white/3 transition-colors ${
                      idx < grouped[category].length - 1 ? 'border-b border-white/5' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <Package size={16} className="text-white/20" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.name}</p>
                      <p className="text-white/40 text-xs">{item.brand}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleAvailable(item)}
                      disabled={toggling === item.id}
                      className={`shrink-0 px-2.5 py-0.5 text-xs font-medium rounded-full border transition-colors ${
                        item.available
                          ? 'bg-[#00e92c]/15 text-[#00e92c] border-[#00e92c]/30 hover:bg-[#00e92c]/25'
                          : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {toggling === item.id ? (
                        <Loader2 size={10} className="animate-spin inline" />
                      ) : item.available ? (
                        'Available'
                      ) : (
                        'Unavailable'
                      )}
                    </button>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/admin/rental-items/${item.id}`}
                        className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-[#00ffff] hover:border-[#00ffff]/30 transition-colors"
                      >
                        <Pencil size={13} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.name)}
                        disabled={deleting === item.id}
                        className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-red-400 hover:border-red-400/30 transition-colors disabled:opacity-50"
                      >
                        {deleting === item.id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

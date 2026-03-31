'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Layers,
  Eye,
  EyeOff,
} from 'lucide-react';
import { getIconComponent } from '@/lib/icon-map';

interface Service {
  id: string;
  slug: string;
  number: string;
  title: string;
  accentColor: string;
  overviewIconName: string;
  published: boolean;
  sortOrder: number;
}

export default function ServicesListPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      if (Array.isArray(data)) setServices(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
    } finally {
      setDeletingId(null);
    }
  }

  async function handleTogglePublished(service: Service) {
    setTogglingId(service.id);
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !service.published }),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) =>
            s.id === service.id ? { ...s, published: !s.published } : s
          )
        );
      }
    } catch {
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Gibson']">Services</h1>
          <p className="text-white/50 text-sm mt-1">Manage your service pages</p>
        </div>
        <Link
          href="/zx9-hub/services/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-[#050505] font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          New Service
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-[#00e92c] animate-spin" />
        </div>
      )}

      {!loading && services.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
          <Layers size={48} className="text-white/20 mb-4" />
          <p className="text-white/50 text-lg mb-2">No services found</p>
          <p className="text-white/30 text-sm mb-6">Get started by creating your first service.</p>
          <Link
            href="/zx9-hub/services/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#00e92c]/20 border border-[#00e92c]/30 text-[#00e92c] text-sm rounded-xl hover:bg-[#00e92c]/30 transition-colors"
          >
            <Plus size={16} />
            New Service
          </Link>
        </div>
      )}

      {!loading && services.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = getIconComponent(service.overviewIconName);
            return (
              <div
                key={service.id}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="p-3 rounded-xl shrink-0"
                      style={{ backgroundColor: `${service.accentColor}15` }}
                    >
                      <Icon size={24} style={{ color: service.accentColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white/30 text-sm font-mono">{service.number}</span>
                        <span
                          className={`px-2.5 py-0.5 text-xs font-medium rounded-lg ${
                            service.published
                              ? 'bg-[#00e92c]/20 text-[#00e92c] border border-[#00e92c]/30'
                              : 'bg-white/10 text-white/50 border border-white/10'
                          }`}
                        >
                          {service.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold text-lg">{service.title}</h3>
                      <p className="text-white/40 text-sm mt-0.5">/{service.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                    <button
                      onClick={() => handleTogglePublished(service)}
                      disabled={togglingId === service.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60 hover:border-white/20 transition-colors disabled:opacity-50"
                    >
                      {togglingId === service.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : service.published ? (
                        <EyeOff size={12} />
                      ) : (
                        <Eye size={12} />
                      )}
                      {service.published ? 'Unpublish' : 'Publish'}
                    </button>

                    <Link
                      href={`/admin/services/${service.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00e92c]/10 border border-[#00e92c]/20 rounded-lg text-xs text-[#00e92c] hover:bg-[#00e92c]/20 transition-colors"
                    >
                      <Pencil size={12} />
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(service.id)}
                      disabled={deletingId === service.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 ml-auto"
                    >
                      {deletingId === service.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Trash2 size={12} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

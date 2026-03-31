'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  FolderOpen,
  Eye,
  EyeOff,
} from 'lucide-react';

interface Project {
  id: string;
  slug: string;
  category: string;
  clientName: string;
  projectTitle: string;
  year: string;
  published: boolean;
  thumbnailImage: string;
  thumbnailAlt: string;
}

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'brand-identity', label: 'Brand Identity' },
  { value: 'digital-campaigns', label: 'Digital Campaigns' },
  { value: 'video-production', label: 'Video Production' },
  { value: 'event-branding', label: 'Event Branding' },
];

export default function WorksListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch('/api/admin/works');
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/works/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
    } finally {
      setDeletingId(null);
    }
  }

  async function handleTogglePublished(project: Project) {
    setTogglingId(project.id);
    try {
      const res = await fetch(`/api/admin/works/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !project.published }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === project.id ? { ...p, published: !p.published } : p
          )
        );
      }
    } catch {
    } finally {
      setTogglingId(null);
    }
  }

  const filtered =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Gibson']">
            Portfolio Projects
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Manage your works and case studies
          </p>
        </div>
        <Link
          href="/zx9-hub/works/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-[#050505] font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          New Project
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 text-sm rounded-xl border transition-all ${
              activeCategory === cat.value
                ? 'bg-[#00e92c]/20 border-[#00e92c]/40 text-[#00e92c]'
                : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-[#00e92c] animate-spin" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
          <FolderOpen size={48} className="text-white/20 mb-4" />
          <p className="text-white/50 text-lg mb-2">No projects found</p>
          <p className="text-white/30 text-sm mb-6">
            {activeCategory !== 'all'
              ? 'Try a different category or create a new project.'
              : 'Get started by creating your first portfolio project.'}
          </p>
          <Link
            href="/zx9-hub/works/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#00e92c]/20 border border-[#00e92c]/30 text-[#00e92c] text-sm rounded-xl hover:bg-[#00e92c]/30 transition-colors"
          >
            <Plus size={16} />
            New Project
          </Link>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 transition-all"
            >
              <div className="relative h-44 bg-white/5">
                {project.thumbnailImage ? (
                  <Image
                    src={project.thumbnailImage}
                    alt={project.thumbnailAlt || project.projectTitle}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FolderOpen size={32} className="text-white/10" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                      project.published
                        ? 'bg-[#00e92c]/20 text-[#00e92c] border border-[#00e92c]/30'
                        : 'bg-white/10 text-white/50 border border-white/10'
                    }`}
                  >
                    {project.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">
                      {project.projectTitle}
                    </h3>
                    <p className="text-white/40 text-sm">{project.clientName}</p>
                  </div>
                  <span className="text-white/30 text-xs ml-2 shrink-0">
                    {project.year}
                  </span>
                </div>

                <span className="inline-block px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white/50 mb-4">
                  {project.category}
                </span>

                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleTogglePublished(project)}
                    disabled={togglingId === project.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60 hover:border-white/20 transition-colors disabled:opacity-50"
                    title={project.published ? 'Unpublish' : 'Publish'}
                  >
                    {togglingId === project.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : project.published ? (
                      <EyeOff size={12} />
                    ) : (
                      <Eye size={12} />
                    )}
                    {project.published ? 'Unpublish' : 'Publish'}
                  </button>

                  <Link
                    href={`/admin/works/${project.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00e92c]/10 border border-[#00e92c]/20 rounded-lg text-xs text-[#00e92c] hover:bg-[#00e92c]/20 transition-colors"
                  >
                    <Pencil size={12} />
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 ml-auto"
                  >
                    {deletingId === project.id ? (
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

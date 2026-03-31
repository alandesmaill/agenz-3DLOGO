'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Camera, FolderOpen, Users, Plus, Image as ImageIcon, Package, Layers } from 'lucide-react';

interface DashboardStats {
  packages: number;
  projects: number;
  admins: number;
  logos: number;
  rentalItems: number;
  services: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ packages: 0, projects: 0, admins: 0, logos: 0, rentalItems: 0, services: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [pkgRes, projRes, adminRes, logosRes, rentalRes, svcRes] = await Promise.all([
          fetch('/api/admin/camera-rental'),
          fetch('/api/admin/works'),
          fetch('/api/admin/settings'),
          fetch('/api/admin/client-logos'),
          fetch('/api/admin/rental-items'),
          fetch('/api/admin/services'),
        ]);
        const [packages, projects, admins, logos, rentalItems, services] = await Promise.all([
          pkgRes.json(),
          projRes.json(),
          adminRes.json(),
          logosRes.json(),
          rentalRes.json(),
          svcRes.json(),
        ]);
        setStats({
          packages: Array.isArray(packages) ? packages.length : 0,
          projects: Array.isArray(projects) ? projects.length : 0,
          admins: Array.isArray(admins) ? admins.length : 0,
          logos: Array.isArray(logos) ? logos.length : 0,
          rentalItems: Array.isArray(rentalItems) ? rentalItems.length : 0,
          services: Array.isArray(services) ? services.length : 0,
        });
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = [
    {
      label: 'Services',
      value: stats.services,
      icon: Layers,
      href: '/admin/services',
      color: '#00b8ff',
    },
    {
      label: 'Camera Packages',
      value: stats.packages,
      icon: Camera,
      href: '/admin/camera-rental',
      color: '#00ffff',
    },
    {
      label: 'Rental Items',
      value: stats.rentalItems,
      icon: Package,
      href: '/admin/rental-items',
      color: '#a78bfa',
    },
    {
      label: 'Client Logos',
      value: stats.logos,
      icon: ImageIcon,
      href: '/admin/client-logos',
      color: '#00e92c',
    },
    {
      label: 'Portfolio Projects',
      value: stats.projects,
      icon: FolderOpen,
      href: '/admin/works',
      color: '#f59e0b',
    },
    {
      label: 'Admin Users',
      value: stats.admins,
      icon: Users,
      href: '/admin/settings',
      color: '#00d4aa',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <img src="/agenz creative hub.svg" alt="Agenz Creative Hub" className="h-10 w-auto mb-2" />
          <p className="text-white/50 text-sm">Manage your website content</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm transition-all"
        >
          View Live Site
          <span className="text-xs">↗</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${card.color}15` }}
                >
                  <Icon size={20} style={{ color: card.color }} />
                </div>
                <span className="text-3xl font-bold text-white">
                  {loading ? '-' : card.value}
                </span>
              </div>
              <p className="text-white/60 text-sm">{card.label}</p>
            </Link>
          );
        })}
      </div>

      <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/camera-rental/new"
          className="flex items-center gap-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#00ffff]/30 transition-all"
        >
          <div className="p-2 bg-[#00ffff]/10 rounded-lg">
            <Plus size={16} className="text-[#00ffff]" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">New Camera Package</p>
            <p className="text-xs text-white/40">Add a new equipment rental package</p>
          </div>
        </Link>
        <Link
          href="/admin/rental-items/new"
          className="flex items-center gap-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#a78bfa]/30 transition-all"
        >
          <div className="p-2 bg-[#a78bfa]/10 rounded-lg">
            <Plus size={16} className="text-[#a78bfa]" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">New Rental Item</p>
            <p className="text-xs text-white/40">Add individual gear for rental</p>
          </div>
        </Link>
        <Link
          href="/admin/client-logos/new"
          className="flex items-center gap-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#00e92c]/30 transition-all"
        >
          <div className="p-2 bg-[#00e92c]/10 rounded-lg">
            <Plus size={16} className="text-[#00e92c]" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Add Client Logo</p>
            <p className="text-xs text-white/40">Add a logo to the Trusted By section</p>
          </div>
        </Link>
        <Link
          href="/admin/works/new"
          className="flex items-center gap-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#f59e0b]/30 transition-all"
        >
          <div className="p-2 bg-[#f59e0b]/10 rounded-lg">
            <Plus size={16} className="text-[#f59e0b]" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">New Portfolio Project</p>
            <p className="text-xs text-white/40">Add a new work to the portfolio</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

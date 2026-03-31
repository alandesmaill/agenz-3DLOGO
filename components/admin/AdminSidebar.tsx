'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Camera,
  FolderOpen,
  Settings,
  LogOut,
  Image as ImageIcon,
  Package,
  PanelTop,
  Layers,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/services', label: 'Services', icon: Layers },
  { href: '/admin/camera-rental', label: 'Camera Rental', icon: Camera },
  { href: '/admin/camera-rental-hero', label: 'Camera Hero', icon: PanelTop },
  { href: '/admin/rental-items', label: 'Rental Items', icon: Package },
  { href: '/admin/client-logos', label: 'Client Logos', icon: ImageIcon },
  { href: '/admin/works', label: 'Works', icon: FolderOpen },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 backdrop-blur-xl bg-[#0a0a0a]/95 border-r border-white/10 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin" className="block" onClick={onClose}>
            <img
              src="/agenz creative hub.svg"
              alt="Agenz Creative Hub"
              className="h-9 w-auto"
            />
            <p className="text-white/40 text-xs mt-1.5">Admin Panel</p>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-[#00e92c]/20 to-[#00ffff]/10 text-white border border-[#00e92c]/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all w-full"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

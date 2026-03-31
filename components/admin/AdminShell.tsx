'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00e92c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') return null;

  return (
    <div className="min-h-screen bg-[#050505]">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="fixed top-0 left-0 right-0 h-14 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 flex items-center px-4 z-30 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-white/60 hover:text-white transition-colors"
        >
          <Menu size={22} />
        </button>
        <img
          src="/agenz creative hub.svg"
          alt="Agenz"
          className="h-6 w-auto ml-3"
        />
      </div>

      <main className="md:ml-64 p-4 pt-[4.5rem] md:p-8 md:pt-8 min-h-screen admin-page">
        {children}
      </main>
    </div>
  );
}

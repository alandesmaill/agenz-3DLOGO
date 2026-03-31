'use client';

import { usePathname } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === '/zx9-hub/login') {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}

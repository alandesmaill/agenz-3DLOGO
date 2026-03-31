import { SessionProvider } from 'next-auth/react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - AGENZ',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}

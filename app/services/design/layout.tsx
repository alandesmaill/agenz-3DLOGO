import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Print & Graphic Design Services - AGENZ',
  description: 'Timeless visual identities that bridge digital and physical touchpoints with creative excellence and attention to detail. Professional graphic design and print services.',
  keywords: [
    'graphic design',
    'print design',
    'brand identity',
    'visual design',
    'logo design',
    'branding',
    'creative design',
  ],
  openGraph: {
    title: 'Print & Graphic Design Services - AGENZ',
    description: 'Timeless visual identities that bridge digital and physical touchpoints with creative excellence.',
    type: 'website',
    url: 'https://agenz.com/services/design',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Print & Graphic Design Services - AGENZ',
    description: 'Timeless visual identities that bridge digital and physical touchpoints.',
  },
};

export default function DesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

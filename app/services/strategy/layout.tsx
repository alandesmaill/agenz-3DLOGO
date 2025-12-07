import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Strategic Media Services - AGENZ',
  description: 'Comprehensive media planning and buying that maximizes ROI through intelligent channel optimization and market insights. Expert strategic media services.',
  keywords: [
    'media planning',
    'media buying',
    'strategic media',
    'channel optimization',
    'ROI optimization',
    'market insights',
    'media strategy',
  ],
  openGraph: {
    title: 'Strategic Media Services - AGENZ',
    description: 'Comprehensive media planning and buying that maximizes ROI through intelligent channel optimization.',
    type: 'website',
    url: 'https://agenz.com/services/strategy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Strategic Media Services - AGENZ',
    description: 'Comprehensive media planning and buying that maximizes ROI.',
  },
};

export default function StrategyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

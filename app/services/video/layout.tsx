import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Production & Music Services - AGENZ',
  description: 'Cinematic storytelling combined with custom soundscapes to create unforgettable brand experiences that resonate. Professional video production and music composition.',
  keywords: [
    'video production',
    'music composition',
    'cinematic storytelling',
    'brand videos',
    'commercial production',
    'sound design',
    'custom music',
  ],
  openGraph: {
    title: 'Video Production & Music Services - AGENZ',
    description: 'Cinematic storytelling combined with custom soundscapes to create unforgettable brand experiences.',
    type: 'website',
    url: 'https://agenz.com/services/video',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Video Production & Music Services - AGENZ',
    description: 'Cinematic storytelling combined with custom soundscapes.',
  },
};

export default function VideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advertising & Social Media Services - AGENZ',
  description: 'Strategic campaigns that amplify your brand across digital platforms with data-driven precision and creative excellence. Expert social media advertising and brand campaigns.',
  keywords: [
    'advertising',
    'social media marketing',
    'digital marketing',
    'brand campaigns',
    'social media strategy',
    'paid social advertising',
    'content marketing',
  ],
  openGraph: {
    title: 'Advertising & Social Media Services - AGENZ',
    description: 'Strategic campaigns that amplify your brand across digital platforms with data-driven precision and creative excellence.',
    type: 'website',
    url: 'https://agenz.com/services/advertising',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advertising & Social Media Services - AGENZ',
    description: 'Strategic campaigns that amplify your brand across digital platforms.',
  },
};

export default function AdvertisingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

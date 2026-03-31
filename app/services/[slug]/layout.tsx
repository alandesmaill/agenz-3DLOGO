import { Metadata } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(`${API_BASE}/api/content/services/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Not found');
    const service = await res.json();

    const title = service.metaTitle || `${service.title} - AGENZ`;
    const description = service.metaDescription || service.heroDescription;

    return {
      title,
      description,
      keywords: service.metaKeywords || [],
      openGraph: {
        title,
        description,
        type: 'website',
        url: `https://agenz-iq.com/services/${slug}`,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch {
    return {
      title: 'Service - AGENZ',
      description: 'Professional creative services by AGENZ',
    };
  }
}

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        slug: true,
        title: true,
        accentColor: true,
        overviewDescription: true,
        overviewIconName: true,
        ctaText: true,
        ctaLink: true,
      },
    });

    return NextResponse.json(services, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (err) {
    console.error('Failed to fetch services:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    );
  }
}

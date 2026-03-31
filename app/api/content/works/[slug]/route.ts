import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const project = await prisma.portfolioProject.findUnique({
    where: { slug, published: true },
    include: {
      heroStats: { orderBy: { sortOrder: 'asc' } },
      galleryItems: { orderBy: { sortOrder: 'asc' } },
      results: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

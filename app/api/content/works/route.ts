import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  const projects = await prisma.portfolioProject.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      heroStats: { orderBy: { sortOrder: 'asc' } },
      galleryItems: { orderBy: { sortOrder: 'asc' } },
      results: { orderBy: { sortOrder: 'asc' } },
    },
  });

  return NextResponse.json(projects);
}

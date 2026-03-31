import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const packages = await prisma.cameraPackage.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        equipmentCategories: {
          orderBy: { sortOrder: 'asc' },
          include: {
            items: { orderBy: { sortOrder: 'asc' } },
          },
        },
      },
    });

    return NextResponse.json(packages, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (err) {
    console.error('Failed to fetch camera packages:', err);
    return NextResponse.json(
      { error: 'Failed to load camera packages' },
      { status: 500 }
    );
  }
}

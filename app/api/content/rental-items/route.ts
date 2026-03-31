import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const items = await prisma.rentalItem.findMany({
      where: { available: true },
      orderBy: [{ sortOrder: 'asc' }],
    });

    return NextResponse.json(items, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (err) {
    console.error('Failed to fetch rental items:', err);
    return NextResponse.json(
      { error: 'Failed to load rental items' },
      { status: 500 }
    );
  }
}

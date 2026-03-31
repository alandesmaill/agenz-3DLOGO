import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { serviceFeatureSchema } from '@/lib/validations/services';
import { z } from 'zod';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const features = await prisma.serviceFeature.findMany({
    where: { serviceId: id },
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json(features);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = z.array(serviceFeatureSchema).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await prisma.serviceFeature.deleteMany({ where: { serviceId: id } });
    const features = await Promise.all(
      parsed.data.map((f, i) =>
        prisma.serviceFeature.create({
          data: { ...f, sortOrder: i, serviceId: id },
        })
      )
    );
    return NextResponse.json(features);
  } catch (err) {
    console.error('Failed to update features:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { cameraPackageSchema } from '@/lib/validations/camera-rental';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const packages = await prisma.cameraPackage.findMany({
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
    return NextResponse.json(packages);
  } catch (err) {
    console.error('Failed to fetch camera packages:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = cameraPackageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const existing = await prisma.cameraPackage.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) {
      return NextResponse.json({ error: 'A package with this slug already exists' }, { status: 409 });
    }

    const pkg = await prisma.cameraPackage.create({ data: parsed.data });
    return NextResponse.json(pkg, { status: 201 });
  } catch (err) {
    console.error('Failed to create camera package:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    );
  }
}

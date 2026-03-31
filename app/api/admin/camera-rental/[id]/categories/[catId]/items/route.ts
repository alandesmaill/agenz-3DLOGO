import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { equipmentItemSchema } from '@/lib/validations/camera-rental';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; catId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { catId } = await params;
  const body = await req.json();
  const parsed = equipmentItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const item = await prisma.equipmentItem.create({
      data: { ...parsed.data, categoryId: catId },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error('Failed to create equipment item:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    );
  }
}

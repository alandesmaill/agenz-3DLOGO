import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { equipmentCategorySchema } from '@/lib/validations/camera-rental';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; catId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { catId } = await params;
  const body = await req.json();
  const parsed = equipmentCategorySchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const category = await prisma.equipmentCategory.update({
      where: { id: catId },
      data: parsed.data,
    });
    return NextResponse.json(category);
  } catch (err) {
    console.error('Failed to update equipment category:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; catId: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { catId } = await params;
  try {
    await prisma.equipmentCategory.delete({ where: { id: catId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to delete equipment category:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    );
  }
}

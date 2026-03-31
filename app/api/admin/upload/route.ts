import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@/lib/auth';

const ALLOWED_TYPES = ['image/webp', 'image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const BUCKET = 'admin-uploads';

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars not configured');
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Allowed: SVG, PNG, JPEG, WebP' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Max 10MB' }, { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
    const path = `${Date.now()}-${sanitized}`;
    const buffer = await file.arrayBuffer();

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (error) {
      if (error.message?.includes('not found') || error.message?.includes('Bucket')) {
        await supabase.storage.createBucket(BUCKET, { public: true });
        const { error: retryError } = await supabase.storage
          .from(BUCKET)
          .upload(path, buffer, { contentType: file.type, upsert: false });
        if (retryError) throw new Error(retryError.message);
      } else {
        throw new Error(error.message);
      }
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error('[upload]', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });

  try {
    const supabase = getSupabase();
    const match = url.match(/admin-uploads\/(.+)$/);
    if (match) {
      await supabase.storage.from(BUCKET).remove([match[1]]);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true }); // Best-effort delete
  }
}

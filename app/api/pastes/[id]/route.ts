import { kv } from '@/lib/kv';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pasteData = await kv.get(`paste:${id}`);

  if (!pasteData) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const paste = typeof pasteData === 'string' ? JSON.parse(pasteData) : pasteData;
  
  const testMode = process.env['TEST_MODE'] === '1';
  const currentTime = testMode && request.headers.get('x-test-now-ms')
    ? parseInt(request.headers.get('x-test-now-ms')!)
    : Date.now();

  if (paste.expires_at && currentTime >= paste.expires_at) {
    await kv.del(`paste:${id}`);
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    paste.remaining_views -= 1;
    if (paste.remaining_views === 0) {
      await kv.del(`paste:${id}`);
    } else {
      await kv.set(`paste:${id}`, JSON.stringify(paste));
    }
  }

  return NextResponse.json({
    content: paste.content,
    remaining_views: paste.remaining_views,
    expires_at: paste.expires_at ? new Date(paste.expires_at).toISOString() : null,
  });
}

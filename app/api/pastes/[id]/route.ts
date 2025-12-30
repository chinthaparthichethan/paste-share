import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check if KV is configured
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const { id } = await params;
  const pasteData = await kv.get(`paste:${id}`);

  if (!pasteData) {
    return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
  }

  const paste = JSON.parse(pasteData as string);

  const testMode = process.env.TEST_MODE === '1';
  const testNowHeader = request.headers.get('x-test-now-ms');
  const currentTime = testMode && testNowHeader ? parseInt(testNowHeader) : Date.now();

  if (paste.expires_at && currentTime >= paste.expires_at) {
    await kv.del(`paste:${id}`);
    return NextResponse.json({ error: 'Paste expired' }, { status: 404 });
  }

  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) {
      await kv.del(`paste:${id}`);
      return NextResponse.json({ error: 'View limit exceeded' }, { status: 404 });
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

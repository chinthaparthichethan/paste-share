import { kv } from '@/lib/kv';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, ttl_seconds, max_views } = body;

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'content is required' }, { status: 400 });
    }

    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return NextResponse.json({ error: 'ttl_seconds must be >= 1' }, { status: 400 });
    }

    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return NextResponse.json({ error: 'max_views must be >= 1' }, { status: 400 });
    }

    const id = nanoid(10);
    const testMode = process.env['TEST_MODE'] === '1';
    const currentTime = testMode && request.headers.get('x-test-now-ms')
      ? parseInt(request.headers.get('x-test-now-ms')!)
      : Date.now();

    const expires_at = ttl_seconds ? currentTime + (ttl_seconds * 1000) : null;

    const pasteData = {
      content,
      expires_at,
      remaining_views: max_views ?? null,
    };

    await kv.set(`paste:${id}`, JSON.stringify(pasteData));

    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const host = request.headers.get('host');
    const url = `${protocol}://${host}/p/${id}`;
    
    return NextResponse.json({ id, url });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

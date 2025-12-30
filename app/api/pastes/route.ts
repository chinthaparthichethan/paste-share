import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, ttl_seconds, max_views } = body;

    // Validation
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'content is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return NextResponse.json(
        { error: 'ttl_seconds must be an integer >= 1' },
        { status: 400 }
      );
    }

    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return NextResponse.json(
        { error: 'max_views must be an integer >= 1' },
        { status: 400 }
      );
    }

    const id = nanoid(10);
    const now = Date.now();
    const expires_at = ttl_seconds ? now + (ttl_seconds * 1000) : null;

    const paste = {
      id,
      content,
      created_at: now,
      expires_at,
      max_views: max_views || null,
      remaining_views: max_views || null,
    };

    await kv.set(`paste:${id}`, JSON.stringify(paste));

    if (ttl_seconds) {
      await kv.expire(`paste:${id}`, ttl_seconds);
    }

    const url = `${process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin}/p/${id}`;

    return NextResponse.json({ id, url });
  } catch (error) {
    console.error('Paste creation error:', error);
    return NextResponse.json({ error: 'Invalid request', details: String(error) }, { status: 400 });
  }
}

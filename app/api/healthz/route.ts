import { kv } from '@/lib/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await kv.ping();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

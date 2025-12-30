import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await kv.ping();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

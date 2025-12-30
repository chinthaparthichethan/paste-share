import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await kv.ping();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('KV ping failed:', error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}

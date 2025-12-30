import { createClient } from '@vercel/kv';
import { NextResponse } from 'next/server';

const kv = createClient({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_URL!.split('@')[0].split('//')[1].split(':')[1] || '',
});

export async function GET() {
  try {
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

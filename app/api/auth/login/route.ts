import { NextRequest, NextResponse } from 'next/server';
import { expectedAdminCredentials, signAdminToken } from '@/app/lib/adminAuth';

export async function POST(req: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const username = String(body.username || '').trim();
  const password = String(body.password || '');
  const expected = expectedAdminCredentials();

  if (username !== expected.username || password !== expected.password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = signAdminToken(username);
  if (!token) {
    return NextResponse.json({ error: 'Missing ADMIN_SESSION_SECRET / WAREHOUSE_SYNC_SECRET' }, { status: 501 });
  }

  return NextResponse.json({ ok: true, token });
}


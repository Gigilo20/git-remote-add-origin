import { NextRequest, NextResponse } from 'next/server';
import { readBearerToken, verifyAdminToken } from '@/app/lib/adminAuth';

export async function GET(req: NextRequest) {
  const token = readBearerToken(req);
  if (!verifyAdminToken(token)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}


import crypto from 'crypto';
import { NextRequest } from 'next/server';

type SessionPayload = {
  u: string;
  exp: number;
};

function b64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function fromB64url(input: string) {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  return Buffer.from(b64 + pad, 'base64');
}

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.WAREHOUSE_SYNC_SECRET || '';
}

export function expectedAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || 'gigiloultra',
    password: process.env.ADMIN_PASSWORD || 'grc2026',
  };
}

export function signAdminToken(username: string) {
  const sec = secret();
  if (!sec) return null;

  const payload: SessionPayload = {
    u: username,
    exp: Date.now() + 1000 * 60 * 60 * 12, // 12 hours
  };
  const data = b64url(JSON.stringify(payload));
  const sig = b64url(crypto.createHmac('sha256', sec).update(data).digest());
  return `${data}.${sig}`;
}

export function verifyAdminToken(token: string | null | undefined) {
  if (!token) return false;
  const sec = secret();
  if (!sec) return false;

  const [data, sig] = token.split('.');
  if (!data || !sig) return false;

  const expectedSig = b64url(crypto.createHmac('sha256', sec).update(data).digest());
  if (sig !== expectedSig) return false;

  try {
    const payload = JSON.parse(fromB64url(data).toString('utf8')) as SessionPayload;
    return !!payload.u && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function readBearerToken(req: NextRequest) {
  const h = req.headers.get('authorization') || '';
  if (!h.toLowerCase().startsWith('bearer ')) return null;
  return h.slice(7).trim();
}


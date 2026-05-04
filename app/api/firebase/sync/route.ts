import { NextRequest, NextResponse } from 'next/server';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readBearerToken, verifyAdminToken } from '@/app/lib/adminAuth';

function checkSecret(req: NextRequest) {
  const secret = process.env.WAREHOUSE_SYNC_SECRET;
  if (!secret) return false;
  return req.headers.get('x-warehouse-secret') === secret;
}
function checkAdmin(req: NextRequest) {
  return verifyAdminToken(readBearerToken(req));
}

function firebaseDb() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!projectId || !clientEmail || !privateKey) return null;

  if (!getApps().length) {
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
  }
  return getFirestore();
}

export async function POST(req: NextRequest) {
  if (!checkSecret(req) || !checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = firebaseDb();
  if (!db) return NextResponse.json({ error: 'Firebase env missing' }, { status: 501 });

  let body: { client_id?: string; label?: string | null; payload?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const clientId = typeof body.client_id === 'string' && body.client_id ? body.client_id : null;
  if (!clientId) return NextResponse.json({ error: 'client_id required' }, { status: 400 });

  const now = new Date();
  const data = {
    client_id: clientId,
    label: body.label ?? null,
    payload: body.payload ?? {},
    updated_at: now.toISOString(),
  };

  await db.collection('warehouse_snapshots').doc(clientId).set(data, { merge: true });
  const historyRef = await db.collection('warehouse_snapshots').doc(clientId).collection('history').add({
    label: data.label,
    payload: data.payload,
    created_at: data.updated_at,
  });

  return NextResponse.json({ id: historyRef.id, created_at: data.updated_at });
}

export async function GET(req: NextRequest) {
  if (!checkSecret(req) || !checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = firebaseDb();
  if (!db) return NextResponse.json({ error: 'Firebase env missing' }, { status: 501 });

  const clientId = req.nextUrl.searchParams.get('client_id');
  if (!clientId) return NextResponse.json({ error: 'client_id query required' }, { status: 400 });
  const mode = req.nextUrl.searchParams.get('mode') || 'latest';
  const limit = Math.max(1, Math.min(200, Number(req.nextUrl.searchParams.get('limit') || 30)));
  const at = req.nextUrl.searchParams.get('at');

  if (mode === 'list') {
    const history = await db
      .collection('warehouse_snapshots')
      .doc(clientId)
      .collection('history')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .get();
    const items = history.docs.map((d) => {
      const x = d.data() as { created_at?: string; label?: string | null };
      return { id: d.id, created_at: x.created_at ?? null, label: x.label ?? null };
    });
    return NextResponse.json({ items });
  }

  if (at) {
    const history = await db
      .collection('warehouse_snapshots')
      .doc(clientId)
      .collection('history')
      .where('created_at', '<=', at)
      .orderBy('created_at', 'desc')
      .limit(1)
      .get();
    if (history.empty) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const d = history.docs[0];
    const x = d.data() as { created_at?: string; label?: string | null; payload?: unknown };
    return NextResponse.json({
      id: d.id,
      created_at: x.created_at ?? null,
      label: x.label ?? null,
      payload: x.payload ?? {},
    });
  }

  const snap = await db.collection('warehouse_snapshots').doc(clientId).get();
  if (!snap.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const d = snap.data() as { label?: string | null; payload?: unknown; updated_at?: string };
  return NextResponse.json({
    id: snap.id,
    created_at: d.updated_at ?? null,
    label: d.label ?? null,
    payload: d.payload ?? {},
  });
}
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function checkSecret(req: NextRequest) {
  const secret = process.env.WAREHOUSE_SYNC_SECRET;
  if (!secret) return false;
  const h = req.headers.get('x-warehouse-secret');
  return h === secret;
}

/** POST — ბრაუზერის localStorage-ის მსგავსი snapshot (JSON) Supabase-ში */
export async function POST(req: NextRequest) {
  if (!checkSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const sb = supabaseAdmin();
  if (!sb) {
    return NextResponse.json({ error: 'Supabase env missing' }, { status: 501 });
  }

  let body: { client_id?: string; label?: string | null; payload?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const client_id = typeof body.client_id === 'string' && body.client_id ? body.client_id : null;
  if (!client_id) {
    return NextResponse.json({ error: 'client_id required' }, { status: 400 });
  }

  const payload = body.payload ?? {};
  const label = body.label ?? null;

  const { data, error } = await sb
    .from('warehouse_snapshots')
    .insert({ client_id, label, payload })
    .select('id, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

/** GET — ბოლო snapshot client_id-ით */
export async function GET(req: NextRequest) {
  if (!checkSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const sb = supabaseAdmin();
  if (!sb) {
    return NextResponse.json({ error: 'Supabase env missing' }, { status: 501 });
  }

  const client_id = req.nextUrl.searchParams.get('client_id');
  if (!client_id) {
    return NextResponse.json({ error: 'client_id query required' }, { status: 400 });
  }
  const mode = req.nextUrl.searchParams.get('mode') || 'latest';
  const limit = Math.max(1, Math.min(200, Number(req.nextUrl.searchParams.get('limit') || 30)));
  const at = req.nextUrl.searchParams.get('at');

  if (mode === 'list') {
    const { data, error } = await sb
      .from('warehouse_snapshots')
      .select('id, created_at, label')
      .eq('client_id', client_id)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ items: data || [] });
  }

  if (at) {
    const { data, error } = await sb
      .from('warehouse_snapshots')
      .select('id, created_at, label, payload')
      .eq('client_id', client_id)
      .lte('created_at', at)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  }

  const { data, error } = await sb
    .from('warehouse_snapshots')
    .select('id, created_at, label, payload')
    .eq('client_id', client_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(data);
}

-- Warehouse Pro — ღრუბლოვანი snapshot-ები (წვდომა API-დან service_role-ით)
-- გაუშვით Supabase SQL Editor-ში ან: supabase db push (თუ CLI დაკავშირებულია)

create table if not exists public.warehouse_snapshots (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id text not null,
  label text,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists warehouse_snapshots_client_created_idx
  on public.warehouse_snapshots (client_id, created_at desc);

comment on table public.warehouse_snapshots is 'Warehouse Pro browser cache / state snapshots; accessed only via Vercel API with WAREHOUSE_SYNC_SECRET';

alter table public.warehouse_snapshots enable row level security;

-- anon/authenticated: პირდაპირი წვდომა არა — მხოლოდ Edge/API service_role
-- (სერვისული გასაღები RLS-ს უგულებელყოფს)

# Warehouse Cloud â€” Vercel + Supabase

áƒáƒ™áƒáƒ•áƒ¨áƒ˜áƒ áƒ”áƒ‘áƒ¡ **Warehouse Pro** (áƒ¡áƒ¢áƒáƒ¢áƒ˜áƒ™áƒ£áƒ áƒ˜ `index.html`) **Supabase**-áƒ¡áƒ áƒ“áƒ **Vercel**-áƒ–áƒ” áƒ’áƒáƒ¨áƒ•áƒ”áƒ‘áƒ£áƒš API-áƒ¡.

## áƒ áƒáƒ¡ áƒáƒ™áƒ”áƒ—áƒ”áƒ‘áƒ¡

| áƒ‘áƒ˜áƒšáƒ˜áƒ™áƒ˜ | áƒ“áƒáƒœáƒ˜áƒ¨áƒœáƒ£áƒšáƒ”áƒ‘áƒ |
|--------|-------------|
| `GET /` | áƒ’áƒáƒ“áƒáƒ›áƒ˜áƒ¡áƒáƒ›áƒáƒ áƒ—áƒ”áƒ‘áƒ â†’ `/index.html` (Warehouse UI) |
| `POST /api/ai/chat` | Claude API áƒžáƒ áƒáƒ¥áƒ¡áƒ˜ â€” `ANTHROPIC_API_KEY` áƒ›áƒ®áƒáƒšáƒáƒ“ áƒ¡áƒ”áƒ áƒ•áƒ”áƒ áƒ–áƒ” |
| `POST /api/warehouse/sync` | Snapshot-áƒ˜áƒ¡ áƒ¨áƒ”áƒœáƒáƒ®áƒ•áƒ Supabase-áƒ¨áƒ˜ (`x-warehouse-secret`) |
| `GET /api/warehouse/sync?client_id=...` | áƒ‘áƒáƒšáƒ snapshot-áƒ˜áƒ¡ áƒ¬áƒáƒ™áƒ˜áƒ—áƒ®áƒ•áƒ |

## 1. Supabase

1. [Supabase Dashboard](https://supabase.com/dashboard) â†’ áƒžáƒ áƒáƒ”áƒ¥áƒ¢áƒ˜ â†’ **SQL Editor**.
2. áƒ©áƒáƒ¡áƒ•áƒ˜áƒ— `supabase/migrations/001_warehouse_snapshots.sql` áƒ“áƒ **Run**.

## 2. áƒšáƒáƒ™áƒáƒšáƒ£áƒ áƒáƒ“

```powershell
cd warehouse-cloud
npm install
Copy-Item -Force ..\warehouse-pro-v9_5.html .\public\index.html
```

(`public\index.html` áƒ£áƒœáƒ“áƒ áƒ”áƒ›áƒ—áƒ®áƒ•áƒ”áƒáƒ“áƒ”áƒ¡ áƒ‘áƒáƒšáƒ `warehouse-pro-v9_5.html`-áƒ¡ â€” áƒ§áƒáƒ•áƒ”áƒš áƒ’áƒáƒœáƒáƒ®áƒšáƒ”áƒ‘áƒáƒ¨áƒ˜ áƒ®áƒ”áƒšáƒáƒ®áƒšáƒ áƒ“áƒáƒáƒ™áƒáƒžáƒ˜áƒ áƒ”áƒ— áƒáƒœ CI-áƒ¨áƒ˜ áƒ“áƒáƒáƒ›áƒáƒ¢áƒ”áƒ— áƒ”áƒ¡ áƒœáƒáƒ‘áƒ˜áƒ¯áƒ˜.)

áƒ¨áƒ”áƒ¥áƒ›áƒ”áƒœáƒ˜áƒ— `.env.local` (áƒ˜áƒ®áƒ˜áƒšáƒ”áƒ— `.env.example`).

```bash
npm run dev
```

áƒ’áƒáƒ®áƒ¡áƒ”áƒœáƒ˜áƒ— [http://localhost:3000](http://localhost:3000) â€” áƒ£áƒœáƒ“áƒ áƒ’áƒáƒ“áƒáƒ’áƒ˜áƒ§áƒ•áƒáƒœáƒáƒ— Warehouse-áƒ–áƒ”. **áƒ¡áƒ¢áƒ áƒáƒ¢áƒ”áƒ’áƒ˜áƒ˜áƒ¡ AI** áƒ˜áƒ›áƒ£áƒ¨áƒáƒ•áƒ”áƒ‘áƒ¡ áƒžáƒ˜áƒ áƒ“áƒáƒžáƒ˜áƒ , áƒ—áƒ£ `ANTHROPIC_API_KEY` áƒ“áƒáƒ§áƒ”áƒœáƒ”áƒ‘áƒ£áƒšáƒ˜áƒ (áƒ‘áƒ áƒáƒ£áƒ–áƒ”áƒ áƒ¨áƒ˜ áƒ’áƒáƒ¡áƒáƒ¦áƒ”áƒ‘áƒ˜áƒ¡ áƒ¨áƒ”áƒ§áƒ•áƒáƒœáƒ áƒáƒ  áƒáƒ áƒ˜áƒ¡ áƒ¡áƒáƒ­áƒ˜áƒ áƒ).

## 3. Vercel

1. áƒáƒ¢áƒ•áƒ˜áƒ áƒ—áƒ”áƒ— áƒ”áƒ¡ áƒ¡áƒáƒ¥áƒáƒ¦áƒáƒšáƒ“áƒ” Git-áƒ¨áƒ˜ (GitHub/GitLab/Bitbucket).
2. [Vercel](https://vercel.com) â†’ **New Project** â†’ áƒáƒ˜áƒ áƒ©áƒ˜áƒ”áƒ— áƒ áƒ”áƒžáƒ.
3. **Environment Variables** (Production + Preview):

   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (áƒ¡áƒáƒ›áƒáƒ›áƒáƒ•áƒšáƒáƒ“ áƒ¤áƒ áƒáƒœáƒ¢áƒ–áƒ”, áƒ—áƒ£ áƒ“áƒáƒ£áƒ›áƒáƒ¢áƒ”áƒ‘áƒ—)
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `WAREHOUSE_SYNC_SECRET` â€” áƒ’áƒ áƒ«áƒ”áƒšáƒ˜ áƒ¨áƒ”áƒ›áƒ—áƒ®áƒ•áƒ”áƒ•áƒ˜áƒ—áƒ˜ áƒ¡áƒ¢áƒ áƒ˜áƒ¥áƒáƒœáƒ˜

4. **Build**: `npm run build`, Output: Next.js defaults.

**áƒ›áƒœáƒ˜áƒ¨áƒ•áƒœáƒ”áƒšáƒáƒ•áƒáƒœáƒ˜:** `public/index.html` áƒ£áƒœáƒ“áƒ áƒ˜áƒ§áƒáƒ¡ áƒ áƒ”áƒžáƒáƒ¨áƒ˜ â€” build-áƒ›áƒ“áƒ” áƒ“áƒáƒáƒ™áƒáƒžáƒ˜áƒ áƒ”áƒ— áƒ’áƒáƒœáƒáƒ®áƒšáƒ”áƒ‘áƒ£áƒšáƒ˜ `warehouse-pro-v9_5.html` (áƒáƒœ CI áƒœáƒáƒ‘áƒ˜áƒ¯áƒ˜ `cp`).

## 4. áƒ¡áƒ˜áƒœáƒ¥áƒ áƒáƒœáƒ˜áƒ¡ áƒ›áƒáƒ’áƒáƒšáƒ˜áƒ—áƒ˜ (curl)

áƒ¨áƒ”áƒœáƒáƒ®áƒ•áƒ:

```bash
curl -sS -X POST "https://YOUR-APP.vercel.app/api/warehouse/sync" ^
  -H "Content-Type: application/json" ^
  -H "x-warehouse-secret: YOUR_SECRET" ^
  -d "{\"client_id\":\"office-pc-1\",\"label\":\"manual\",\"payload\":{\"note\":\"test\"}}"
```

áƒ©áƒáƒ¢áƒ•áƒ˜áƒ áƒ—áƒ•áƒ:

```bash
curl -sS "https://YOUR-APP.vercel.app/api/warehouse/sync?client_id=office-pc-1" ^
  -H "x-warehouse-secret: YOUR_SECRET"
```

áƒ¨áƒ”áƒ›áƒ“áƒ”áƒ’ áƒ”áƒ¢áƒáƒžáƒ–áƒ” áƒ¨áƒ”áƒ’áƒ˜áƒ«áƒšáƒ˜áƒáƒ— Warehouse HTML-áƒ¨áƒ˜ áƒ¦áƒ˜áƒšáƒáƒ™áƒ”áƒ‘áƒ˜ áƒ“áƒáƒáƒ›áƒáƒ¢áƒáƒ—, áƒ áƒáƒ›áƒšáƒ”áƒ‘áƒ˜áƒª `wp_cache_*` localStorage-áƒ¡ JSON-áƒáƒ“ áƒ’áƒáƒ’áƒ–áƒáƒ•áƒœáƒ˜áƒáƒœ áƒáƒ› API-áƒ–áƒ”.

## áƒ£áƒ¡áƒáƒ¤áƒ áƒ—áƒ®áƒáƒ”áƒ‘áƒ

- `SUPABASE_SERVICE_ROLE_KEY` **áƒáƒ áƒáƒ¡áƒáƒ“áƒ”áƒ¡** áƒ©áƒáƒ¡áƒ•áƒáƒ— `NEXT_PUBLIC_*` áƒáƒœ áƒ‘áƒ áƒáƒ£áƒ–áƒ”áƒ áƒ˜áƒ¡ áƒ™áƒáƒ“áƒ¨áƒ˜.
- `WAREHOUSE_SYNC_SECRET` áƒ˜áƒ’áƒ˜áƒ•áƒ”áƒ â€” áƒ›áƒ®áƒáƒšáƒáƒ“ áƒ—áƒ¥áƒ•áƒ”áƒœáƒ˜ áƒáƒžáƒ˜/áƒ¡áƒ™áƒ áƒ˜áƒžáƒ¢áƒ”áƒ‘áƒ˜; áƒ›áƒáƒ’áƒ•áƒ˜áƒáƒœáƒ”áƒ‘áƒ˜áƒ— áƒ¨áƒ”áƒªáƒ•áƒáƒšáƒ”áƒ— **Supabase Auth** + RLS `auth.uid()`-áƒ˜áƒ—.

## áƒ“áƒáƒ™áƒ£áƒ›áƒ”áƒœáƒ¢áƒáƒªáƒ˜áƒ

- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Supabase API](https://supabase.com/docs/guides/api)

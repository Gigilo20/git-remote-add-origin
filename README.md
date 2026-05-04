# Warehouse Cloud — Vercel + Supabase

აკავშირებს **Warehouse Pro** (სტატიკური `index.html`) **Supabase**-სა და **Vercel**-ზე გაშვებულ API-ს.

## რას აკეთებს

| ბილიკი | დანიშნულება |
|--------|-------------|
| `GET /` | გადამისამართება → `/index.html` (Warehouse UI) |
| `POST /api/ai/chat` | Claude API პროქსი — `ANTHROPIC_API_KEY` მხოლოდ სერვერზე |
| `POST /api/warehouse/sync` | Snapshot-ის შენახვა Supabase-ში (`x-warehouse-secret`) |
| `GET /api/warehouse/sync?client_id=...` | ბოლო snapshot-ის წაკითხვა |

## 1. Supabase

1. [Supabase Dashboard](https://supabase.com/dashboard) → პროექტი → **SQL Editor**.
2. ჩასვით `supabase/migrations/001_warehouse_snapshots.sql` და **Run**.

## 2. ლოკალურად

```powershell
cd warehouse-cloud
npm install
Copy-Item -Force ..\warehouse-pro-v9_5.html .\public\index.html
```

(`public\index.html` უნდა ემთხვეოდეს ბოლო `warehouse-pro-v9_5.html`-ს — ყოველ განახლებაში ხელახლა დააკოპირეთ ან CI-ში დაამატეთ ეს ნაბიჯი.)

შექმენით `.env.local` (იხილეთ `.env.example`).

```bash
npm run dev
```

გახსენით [http://localhost:3000](http://localhost:3000) — უნდა გადაგიყვანოთ Warehouse-ზე. **სტრატეგიის AI** იმუშავებს პირდაპირ, თუ `ANTHROPIC_API_KEY` დაყენებულია (ბრაუზერში გასაღების შეყვანა არ არის საჭირო).

## 3. Vercel

1. ატვირთეთ ეს საქაღალდე Git-ში (GitHub/GitLab/Bitbucket).
2. [Vercel](https://vercel.com) → **New Project** → აირჩიეთ რეპო.
3. **Environment Variables** (Production + Preview):

   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (სამომავლოდ ფრონტზე, თუ დაუმატებთ)
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `WAREHOUSE_SYNC_SECRET` — გრძელი შემთხვევითი სტრიქონი

4. **Build**: `npm run build`, Output: Next.js defaults.

**მნიშვნელოვანი:** `public/index.html` უნდა იყოს რეპოში — build-მდე დააკოპირეთ განახლებული `warehouse-pro-v9_5.html` (ან CI ნაბიჯი `cp`).

## 4. სინქრონის მაგალითი (curl)

შენახვა:

```bash
curl -sS -X POST "https://YOUR-APP.vercel.app/api/warehouse/sync" ^
  -H "Content-Type: application/json" ^
  -H "x-warehouse-secret: YOUR_SECRET" ^
  -d "{\"client_id\":\"office-pc-1\",\"label\":\"manual\",\"payload\":{\"note\":\"test\"}}"
```

ჩატვირთვა:

```bash
curl -sS "https://YOUR-APP.vercel.app/api/warehouse/sync?client_id=office-pc-1" ^
  -H "x-warehouse-secret: YOUR_SECRET"
```

შემდეგ ეტაპზე შეგიძლიათ Warehouse HTML-ში ღილაკები დაამატოთ, რომლებიც `wp_cache_*` localStorage-ს JSON-ად გაგზავნიან ამ API-ზე.

## უსაფრთხოება

- `SUPABASE_SERVICE_ROLE_KEY` **არასოდეს** ჩასვათ `NEXT_PUBLIC_*` ან ბრაუზერის კოდში.
- `WAREHOUSE_SYNC_SECRET` იგივეა — მხოლოდ თქვენი აპი/სკრიპტები; მოგვიანებით შეცვალეთ **Supabase Auth** + RLS `auth.uid()`-ით.

## დოკუმენტაცია

- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Supabase API](https://supabase.com/docs/guides/api)

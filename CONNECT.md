# GitHub + Vercel + Supabase — დაკავშირება

AI აგენტს **შენი** ანგარიშებზე პირდაპირი წვდომა არ აქვს. ქვემოთ — რა გააკეთო შენ, და სად დაგეხმარება Cursor MCP.

## 1) GitHub

1. [github.com/new](https://github.com/new) — ახალი რეპო (მაგ. `warehouse-cloud`), **არ** დაამატო README (რეპო უკვე ინიციალიზებულია).
2. PowerShell (შეცვალე `YOUR_USER` და `warehouse-cloud`):

```powershell
cd "c:\Users\My Dell\Downloads\warehouse-cloud"
git branch -M main
git remote add origin https://github.com/YOUR_USER/warehouse-cloud.git
git push -u origin main
```

თუ HTTPS ითხოვს ლოგინს: [Personal Access Token](https://github.com/settings/tokens) (repo) გამოიყენე პაროლის ნაცვლად.

## 2) Vercel

1. [vercel.com/new](https://vercel.com/new) → Import **იგივე GitHub რეპო**.
2. Root: `warehouse-cloud` (თუ მონო-რეპოა — root `.`).
3. **Environment Variables** (Production):

| Name | საიდან |
|------|--------|
| `ANTHROPIC_API_KEY` | Anthropic Console |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | იქვე |
| `SUPABASE_SERVICE_ROLE_KEY` | იქვე (**არასოდეს** ფრონტზე სხვა კოდში) |
| `WAREHOUSE_SYNC_SECRET` | შენ მიერ გენერირებული გრძელი საიდუმლო |

4. Deploy. URL მიიღებ `*.vercel.app` — Warehouse: **გახსენი `/` ან `/index.html`**.

## 3) Supabase

1. SQL Editor-ში უკვე გაქვს გაშვებული `001_warehouse_snapshots.sql` (შიგთავსი, არა ფაილის გზა).
2. **Project Settings → API** — დააკოპირე URL და keys Vercel env-ში.

## 4) Cursor-ში MCP (რომ აგენტმა „უფრო დაგეხმაროს“)

Cursor → **Settings → MCP** (ან Features):

- **Vercel** plugin: გაუშვი **Authenticate** / `mcp_auth` — ბრაუზერში შენი Vercel ანგარიშით.
- **Supabase** plugin: იგივე — OAuth Supabase-ზე.

ავთენტიფიკაციის შემდეგ ახალ ჩატში შეგიძლია დაწერო: „დააკავშირე ეს პროექტი Vercel-ზე“ / „შეამოწმე Supabase ცხრილი“ — ინსტრუმენტებს შენს უკვე დაკავშირებულ პროექტებზე წვდომა ექნებათ (შენს მიერ მინიჭებული უფლებების ფარგლებში).

## CLI (სურვილისამებრ)

შენს მანქანაზე არ არის `gh` / `vercel` / `supabase` PATH-ში. შეგიძლია:

```powershell
npm i -g vercel
# ან: npx vercel login && npx vercel link
```

---

**შეჯამება:** დაკავშირება = **შენი ერთჯერადი ლოგინები** (GitHub push, Vercel import, env vars, Supabase SQL). რეპო ლოკალურად უკვე `git init` + პირველი commit მზადაა `warehouse-cloud`-ში.

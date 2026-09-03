# M&M Pro Construction — website + owner dashboard

Next.js 16 site for M&M Pro Construction with a private dashboard at `/admin`
that lets the owner manage projects, videos, photos, testimonials, services,
job postings, page layouts (drag-and-drop sections), business info, SEO and
ad tracking — without touching code or a database console.

## Local development

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD
npm run dev
```

- Site: http://localhost:3000
- Dashboard: http://localhost:3000/admin (password from `.env.local`; if none is
  set, `admin` works in development only)

With no storage keys set, content is saved to `content/site.json` and uploads
to `public/uploads/`. Both are git-ignored.

## Deploying on Vercel (recommended)

1. Push to GitHub and import the repo in Vercel.
2. **Storage → Create → Blob**, then connect the store to the project. This
   injects `BLOB_READ_WRITE_TOKEN` automatically.
3. **Settings → Environment Variables**: add `ADMIN_PASSWORD` (and optionally
   `ADMIN_SESSION_SECRET`, a long random string).
4. Deploy. Sign in at `https://<your-domain>/admin`.

The very first time the dashboard loads it shows the site exactly as it was
hand-coded; the first save writes the content document to Blob. Every save
keeps the previous version (last 30) under Dashboard → Version History.

### Using Supabase instead

1. Create a project, open **SQL Editor**, run `supabase/schema.sql`.
2. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel.

### Other providers

Storage is behind one small interface (`src/lib/storage/types.ts`): read/write
one JSON document, keep versions, and upload/delete media files. Add a file
next to `vercel-blob.ts` / `supabase.ts` and register it in
`src/lib/storage/index.ts`.

## How content flows

```
Dashboard (client) ──server action──▶ storage provider ──▶ revalidate
                                            │
Public pages ◀── getSiteContent() (cached, tag "site-content") ◀──┘
```

- `src/lib/content/types.ts` — the single `SiteContent` document
- `src/lib/content/defaults.ts` — seed content (the original site)
- `src/lib/content/sections.ts` — section types + the form schema the page
  builder renders. Add a section here and a renderer in
  `src/components/sections/index.tsx`.
- `src/app/admin/*` — dashboard pages and server actions
- `src/app/api/admin/upload` — upload endpoint (Blob client tokens, signed
  URLs for Supabase, direct multipart locally). Videos never pass through a
  serverless function body, so 1–2 GB files work.

## SEO / AI search

- `generateMetadata` everywhere, driven from the dashboard (titles,
  descriptions, share images, verification tags).
- JSON-LD: `GeneralContractor`/`LocalBusiness`, `WebSite`, `Service` catalog,
  `CreativeWork` per project with `ImageObject`s, `VideoObject` per video,
  `FAQPage`, `BreadcrumbList`, `AggregateRating`/`Review`.
- `/sitemap.xml` (with image + video entries), `/robots.txt` (AI-crawler toggle),
  `/llms.txt` and `/llms-full.txt`.
- Tracking: GA4, Google Tag Manager, Google Ads conversions (form, phone,
  application), Meta Pixel, Microsoft Clarity — all from Dashboard → SEO &
  Tracking.

## Forms

Contact and careers forms post to FormSubmit.co from the browser (Cloudflare
blocks server-side posts). The recipient is set under Dashboard → Business Info.

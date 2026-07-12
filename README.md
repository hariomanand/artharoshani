# ArthaPath — CBSE Economics 10–12 📈

A free, offline-first **Progressive Web App** for CBSE Economics (Classes 10, 11 & 12) with:

- 📖 **Chapter-wise & lesson-wise notes** aligned to NCERT, with infographics, connector diagrams, tables & key terms
- 🔬 **Technical Economics Labs** — 6 interactive in-browser tools (OLS regression, market simulator, sentiment analysis, behavioral game, time-series, growth calculator)
- 📝 **Practice question bank** with a real-PYQ import slot
- ⚙️ **Admin panel** — edit notes, upload PPT/infographics, manage labs, users & announcements
- 📴 **Works fully offline**, installable to any phone's home screen

## Cost: ₹0

| Layer | Service | Free tier |
|---|---|---|
| Hosting + domain | **Cloudflare Pages** | Unlimited requests, free `*.pages.dev` domain |
| Database + Auth + Storage | **Supabase** | 500 MB DB, 1 GB storage, 50k monthly users |
| Source control | **GitHub** | Free public/private repos |

The public learning app runs with **no backend at all** — content is bundled. Supabase is only needed for the admin panel and live content updates.

## Run locally

```bash
npm run dev        # starts http://localhost:5173
```

(Requires Node.js. It's a zero-dependency static server — no build step.)

## Project structure

```
index.html          app shell        admin.html      admin panel
css/                styles           js/app.js       router + views
js/labs.js          lab tools        js/admin.js     admin logic
js/supabase.js      cloud client     js/content.js   offline-first sync
js/config.js        ← put Supabase keys here
data/class10-12.js  curriculum       data/labs.js    lab catalog
supabase/schema.sql database setup   DEPLOYMENT.md   full deploy guide
```

## Deploy

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for the complete free deployment (GitHub → Cloudflare Pages → Supabase → free domain), in ~15 minutes.

## A note on content

Notes are original explanations of NCERT concepts (not verbatim reproductions). Seeded questions are **practice** questions; authentic CBSE past-year questions can be imported via the admin panel or `data/` files (marked `source: "pyq"`).

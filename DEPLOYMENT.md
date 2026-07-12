# 🚀 ArthaPath — Full Free Deployment Guide

Deploy the whole app for **₹0** using **GitHub + Cloudflare Pages + Supabase**. Total time ≈ 15 minutes. No credit card required.

> The public app works offline with **zero backend**. You only need Supabase (Steps 3–5) if you want the **admin panel**, uploads and live content edits.

---

## Step 1 — Put the code on GitHub

1. Create a free account at <https://github.com> and click **New repository** → name it `arthapath` → **Create**.
2. On your PC, in the `econ-master` folder:

```bash
git init
git add .
git commit -m "ArthaPath initial release"
git branch -M main
git remote add origin https://github.com/<your-username>/arthapath.git
git push -u origin main
```

(If `git` asks you to sign in, use your GitHub username + a **Personal Access Token** as the password: GitHub → Settings → Developer settings → Tokens.)

---

## Step 2 — Host on Cloudflare Pages (free hosting + free domain)

1. Sign up free at <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorise GitHub and pick your `arthapath` repo.
3. Build settings — **leave everything empty** (this is a no-build static site):
   - Framework preset: **None**
   - Build command: *(blank)*
   - Build output directory: `/`
4. Click **Save and Deploy**.
5. In ~30 seconds you get a live URL like **`https://arthapath.pages.dev`** — that's your free domain. ✅

Every future `git push` auto-deploys.

### (Optional) A custom free domain
- Cloudflare's `*.pages.dev` is already free and permanent.
- Want a nicer name? Register a cheap domain and add it under **Pages → your project → Custom domains**, or use a free subdomain service. Point it at the Pages project — Cloudflare handles HTTPS automatically.

---

## Step 3 — Create a free Supabase project

1. Sign up free at <https://supabase.com> → **New project**.
2. Choose a name + a strong database password + region (pick the closest, e.g. Mumbai/Singapore). Wait ~2 min for it to provision.
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `https://xxxx.supabase.co`
   - **anon public** key (safe to expose)

---

## Step 4 — Set up the database

1. In Supabase, open **SQL Editor → New query**.
2. Open `supabase/schema.sql` from this repo, copy **all** of it, paste, and click **Run**.
   - This creates all tables, security rules, the storage bucket and the sign-up trigger.

---

## Step 5 — Connect the app + create your admin

1. Edit **`js/config.js`** and paste your values:

```js
export const SUPABASE_URL = 'https://xxxx.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJ...your-anon-key...';
```

2. Commit & push:

```bash
git add js/config.js && git commit -m "Connect Supabase" && git push
```

3. Create your admin login: Supabase → **Authentication → Users → Add user** (enter your email + a password, tick *Auto Confirm*).
4. Make that user an admin: **SQL Editor**, run (with your email):

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

5. Open **`https://arthapath.pages.dev/admin.html`**, sign in — you're in the admin panel. 🎉

---

## Using the admin panel

| Tab | What you can do |
|---|---|
| 📊 Dashboard | Live counts of content, media, labs, users |
| 📝 Notes | Override/expand any chapter's notes & questions (publishes instantly) |
| 📎 Media/PPT | Upload PPT, PDF, infographics or notes → appear on the chapter page |
| 🔬 Labs | Edit lab titles, taglines & descriptions |
| 👥 Users | See sign-ups, promote/demote admins |
| 📢 Announce | Post an announcement banner |

Uploaded files go to the public **`media`** storage bucket and are linked to a chapter automatically.

---

## Updating content in code (alternative to admin)

- **Notes/chapters:** edit `data/class10.js`, `class11.js`, `class12.js` (block schema documented in the admin *Notes* tab and `js/blocks.js`).
- **Add real CBSE PYQs:** add question objects with `source: "pyq"`, `year: 2023` to a chapter's `questions` array — they auto-show a gold **PYQ** badge.
- **Labs:** edit `data/labs.js`; interactive tools live in `js/labs.js`.
- Push to GitHub → Cloudflare redeploys automatically.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Admin says "Cloud not connected" | Fill `js/config.js` with real values and push. |
| Login works but "Not an admin" | Run the `update profiles set role='admin'` SQL for your email. |
| Uploads fail | Confirm Step 4 ran fully (the `media` bucket + storage policies must exist). |
| Old version still showing | The service worker is network-first; hard-refresh once (Ctrl+Shift+R). |
| Offline not working | Open the site online once so the service worker can cache it. |

That's it — a production-grade, zero-cost economics learning platform. 🎓

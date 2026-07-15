# 🚀 ArthaRoshni — Full Free Deployment Guide

Deploy the whole app for **₹0** using **GitHub + Cloudflare Pages + Supabase**, with real student/teacher accounts, email-OTP verification, gated labs and a secure admin panel. Total time ≈ 20 minutes. No credit card required.

> **What needs a backend?** Chapter notes, quizzes and the Blueprint work offline with **zero backend**. Accounts, the labs lock, the catalogue download log and the admin panel all need Supabase (Steps 3–6). Email OTP delivery to real users needs a free SMTP account (Step 7).

---

## Step 1 — Put the code on GitHub

1. Create a free account at <https://github.com> and click **New repository** → name it `artharoshni` → **Create**.
2. On your PC, in the `econ-master` folder:

```bash
git init
git add .
git commit -m "ArthaRoshni release"
git branch -M main
git remote add origin https://github.com/<your-username>/artharoshni.git
git push -u origin main
```

(If `git` asks you to sign in, use your GitHub username + a **Personal Access Token** as the password: GitHub → Settings → Developer settings → Tokens.)

---

## Step 2 — Host on Cloudflare Pages (free hosting + free domain)

1. Sign up free at <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorise GitHub and pick your `artharoshni` repo.
3. Build settings — **leave everything empty** (this is a no-build static site):
   - Framework preset: **None**
   - Build command: *(blank)*
   - Build output directory: `/`
4. Click **Save and Deploy**. In ~30 seconds you get **`https://artharoshni.pages.dev`** — your free, permanent, HTTPS domain. ✅

Every future `git push` auto-deploys.

---

## Step 3 — Create a free Supabase project

1. Sign up free at <https://supabase.com> → **New project**.
2. Choose a name + a strong database password + the closest region (Mumbai/Singapore). Wait ~2 min.
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `https://xxxx.supabase.co`
   - **anon public** key (safe to expose — Row Level Security protects the data)

---

## Step 4 — Set up the database (security included)

1. In Supabase, open **SQL Editor → New query**.
2. Open `supabase/schema.sql` from this repo, copy **all** of it, paste, and click **Run**.

This creates every table, the storage bucket, the sign-up trigger, and the security rules — including two protections that matter:

- **`role` can never be set by a user.** The sign-up trigger hard-codes new accounts to `role = 'user'`; a `before update` trigger blocks anyone who isn't already an admin from changing any role, and stops admins from changing their own. So even though the app sends sign-up details to the database, nobody can register or edit their way to admin.
- **User records are admin-only.** Regular users can read only their own profile row; only admins can list everyone or read the catalogue-download log.

---

## Step 5 — Connect the app

1. Edit **`js/config.js`** and paste your two values:

```js
export const SUPABASE_URL = 'https://xxxx.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJ...your-anon-key...';
```

2. Commit & push:

```bash
git add js/config.js && git commit -m "Connect Supabase" && git push
```

---

## Step 6 — Create your first admin

The role guard blocks role changes from the app, so the **first** admin must be promoted in the SQL editor (which runs as a superuser and bypasses the guard).

1. Create the login: Supabase → **Authentication → Users → Add user** → enter your email + a password, tick **Auto Confirm User**.
2. Promote it: **SQL Editor → New query**, paste (with your email) and **Run**:

```sql
alter table public.profiles disable trigger on_profile_update_guard;
update public.profiles set role = 'admin' where email = 'you@example.com';
alter table public.profiles enable trigger on_profile_update_guard;

-- confirm:
select email, role from public.profiles where role = 'admin';
```

3. Open **`https://artharoshni.pages.dev/admin.html`** and sign in. 🎉
   The page shows only a plain "Sign in" box — no branding or hints — and rejects non-admin accounts with a generic "Invalid credentials".

> After this, promote or demote further admins from the **Users** tab in the panel — no SQL needed. That path goes through the guard safely because you're already an admin acting on **another** user.

---

## Step 7 — Turn on email OTP (so real students receive codes)

Sign-up verification and password reset both email a **6-digit code**. Supabase's built-in email sender is capped at a few messages per hour and is fine for **your own testing only** — real students will not receive codes until you connect a free SMTP provider. This is the one part only you can do (it needs your own account).

### 7a. Get free SMTP credentials (Brevo — 300 emails/day free)

1. Sign up at <https://www.brevo.com> (free, no card).
2. Go to **SMTP & API → SMTP**. Note:
   - **SMTP server**: `smtp-relay.brevo.com`
   - **Port**: `587`
   - **Login**: the login they show (an email-like string)
   - **Password (SMTP key)**: click **Generate a new SMTP key** and copy it
3. Under **Senders**, add and verify the "from" address you'll send as (e.g. `noreply@yourdomain` or a Gmail you own).

*(Prefer Resend? Use `smtp.resend.com`, port `587`, and their API key as the password — but Resend requires verifying a domain you own.)*

### 7b. Plug it into Supabase

1. Supabase → **Project Settings → Authentication → SMTP Settings** → **Enable Custom SMTP**.
2. Enter the host, port `587`, login and SMTP key from Brevo, and your verified sender address. **Save**.

### 7c. Make the emails send a CODE, not a link

The app verifies OTP codes, so the templates must include the token. Supabase → **Authentication → Email Templates**:

- **Confirm signup** — set the body to include the code:
  ```
  Your ArthaRoshni verification code is: {{ .Token }}
  ```
- **Reset password** — same idea:
  ```
  Your ArthaRoshni password reset code is: {{ .Token }}
  ```

> Keep `{{ .Token }}` exactly as written. If you leave the default magic-link template, users get a link instead of a code and the 6-digit screen won't work.

### 7d. Point auth redirects at your domain

Supabase → **Authentication → URL Configuration** → set **Site URL** to `https://artharoshani.pages.dev` (and add it under **Redirect URLs**).

---

## How accounts & gating work

- **Sign up** (`#/signup`): name, role (student / teacher / professional / other), email (required), phone (optional), school/organisation (optional), password + confirm with a live strength meter. On submit, a 6-digit code is emailed.
- **Verify** (`#/verify`): enter the code → account confirmed → redirected to **Sign in** (as requested, sign-up does not auto-enter the app).
- **Sign in** (`#/login`) and **Forgot password** (`#/forgot` → `#/reset`), both code-based.
- **Locked** content: `#/labs`, every individual lab, and the 500-lab catalogue require a signed-in account. A signed-out visitor sees a "Sign in to open the labs" screen and is returned to where they were after logging in.
- **Public** (still free, still indexable): the home/marketing pages, chapter notes, quizzes, practice bank and the India Blueprint.

## The 500-lab catalogue & gated download

- The catalogue lists **10 labs per page** with a pager (500 labs → 50 pages), plus search and track/level filters.
- The **Download PDF** button opens a short form (name, email, purpose). On submit the request is recorded to the `lab_downloads` table and the PDF downloads. Every request shows up in the admin **Downloads** tab.

## Using the admin panel

| Tab | What you can do |
|---|---|
| 📊 Dashboard | Live counts: registered users, catalogue downloads, content, media, labs |
| 📝 Notes | Override/expand any chapter's notes & questions (publishes instantly) |
| 📎 Media/PPT | Upload PPT, PDF, infographics or notes → appear on the chapter page |
| 🔬 Labs | Edit lab titles, taglines & descriptions |
| 👥 Users | Full user records (name, role, email, phone, organisation, joined) — search, filter, promote/demote admins, **export CSV** |
| ⬇️ Downloads | Everyone who downloaded the catalogue, with their stated purpose — search, **export CSV** |
| 📢 Announce | Post an announcement banner |

---

## Security summary (what protects your data)

- **No privilege escalation** — sign-up metadata cannot set `role`; a DB trigger is the real boundary, not just UI. (See the comments in `supabase/schema.sql`.)
- **Row Level Security everywhere** — users read only their own profile; only admins read user records and download logs; content/media/labs are admin-write only.
- **Admin login reveals nothing** — no product name, no "this is an admin panel", no backend or role hints; generic errors; non-admins are signed straight back out.
- **`admin.html` is de-indexed** — `noindex`/`no-referrer` in the page head, in `_headers`, and in `robots.txt`.
- **Hardened headers** (`_headers`) — HSTS, `X-Frame-Options`, `Permissions-Policy`, `no-store` on the admin page.

> **Rotate the key if it was ever public.** The `anon` key is designed to be public and is safe **because** RLS is on — but if you want a clean slate, Supabase → Settings → API → **rotate**, then update `js/config.js`. Never put the **service_role** key in this project; it bypasses RLS.

---

## Regenerating the catalogue / PDF

```bash
node tools/gen-catalogue.js       # rewrites data/catalogue.js + .json
pip install reportlab             # one-time
python tools/build-pdf.py         # rebuilds ArthaRoshni-500-Labs-Catalogue.pdf
```
Then `git push` — Cloudflare redeploys automatically.

## Updating content in code (alternative to admin)

- **Notes/chapters:** edit `data/class10.js`, `class11.js`, `class12.js` (block schema is documented in the admin *Notes* tab and `js/blocks.js`).
- **Add real CBSE PYQs:** add question objects with `source:"pyq"`, `year:2023` to a chapter's `questions` array — they auto-show a gold **PYQ** badge.
- **Labs:** edit `data/labs.js`; interactive tools live in `js/labs.js`.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Students don't get the code | Custom SMTP not set up — do **Step 7**. The built-in sender is rate-limited to a few/hour. |
| They get a link, not a 6-digit code | Edit the email templates to use `{{ .Token }}` (Step 7c). |
| "Invalid credentials" for a real admin | Confirm the promote SQL ran (Step 6) — `select email, role from profiles where role='admin'`. |
| Admin login loops back to sign-in | That account isn't an admin — it's rejected by design. Promote it (Step 6). |
| Uploads fail | Confirm the schema ran fully (the `media` bucket + storage policies must exist). |
| Old version still showing | The service worker is network-first; hard-refresh once (Ctrl+Shift+R). |
| Offline not working | Open the site online once so the service worker can cache it. |
| `/admin` shows too-many-redirects | Don't add `/admin /admin.html` to `_redirects` — Pages serves the clean URL itself. |

That's it — a production-grade, zero-cost economics platform with real accounts and a locked-down admin. 🎓

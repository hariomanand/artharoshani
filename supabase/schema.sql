-- ================================================================
-- ArthaRoshni — Supabase schema (run once in SQL Editor)
-- Creates tables, Row Level Security, an admin helper, the profile
-- auto-creation trigger, and policies. Safe to re-run.
--
-- SECURITY MODEL
--   profiles.role      = authorization  ('user' | 'admin')  — NEVER client-settable
--   profiles.user_type = self-declared  ('student' | 'teacher' | 'professional' | 'other')
--   The two are deliberately separate columns. Sign-up metadata is
--   attacker-controlled, so it may only ever populate user_type.
-- ================================================================

-- ---------- PROFILES (mirrors auth.users, holds role) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user',           -- 'user' | 'admin'  (authorization)
  created_at timestamptz not null default now()
);

-- New registration fields (added idempotently for existing installs)
alter table public.profiles add column if not exists user_type    text;
alter table public.profiles add column if not exists phone        text;
alter table public.profiles add column if not exists organisation text;
alter table public.profiles add column if not exists last_seen_at timestamptz;

-- Only these four values are meaningful for user_type.
do $$ begin
  alter table public.profiles add constraint profiles_user_type_chk
    check (user_type is null or user_type in ('student','teacher','professional','other'));
exception when duplicate_object then null; end $$;

-- role is authorization — constrain it hard.
do $$ begin
  alter table public.profiles add constraint profiles_role_chk
    check (role in ('user','admin'));
exception when duplicate_object then null; end $$;

-- Admin check helper. SECURITY DEFINER so it can read profiles without
-- recursing through profiles' own RLS policies.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Auto-create a profile row whenever a user signs up.
-- NOTE: raw_user_meta_data is supplied by the client at signUp() and is therefore
-- UNTRUSTED. It populates user_type/phone/organisation only. `role` is hard-coded
-- to 'user' — never read from metadata, or anyone could register as an admin.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role, user_type, phone, organisation)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'user',                                              -- always 'user'; never from metadata
    case when new.raw_user_meta_data->>'user_type'
              in ('student','teacher','professional','other')
         then new.raw_user_meta_data->>'user_type' else 'other' end,
    nullif(new.raw_user_meta_data->>'phone', ''),
    nullif(new.raw_user_meta_data->>'organisation', '')
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- PRIVILEGE-ESCALATION GUARD ----------
-- RLS is row-level, not column-level: a `for update` policy that allows a user to
-- edit their own row would also let them set role='admin' on it. This trigger is
-- the actual boundary — only an existing admin may change a role, and nobody may
-- change their own.
create or replace function public.guard_profile_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role then
    if not public.is_admin() then
      raise exception 'Only an admin may change a role';
    end if;
    if old.id = auth.uid() then
      raise exception 'Admins may not change their own role';
    end if;
  end if;
  -- id and created_at are immutable
  new.id := old.id;
  new.created_at := old.created_at;
  return new;
end; $$;

drop trigger if exists on_profile_update_guard on public.profiles;
create trigger on_profile_update_guard
  before update on public.profiles
  for each row execute function public.guard_profile_role();

-- ---------- CONTENT (admin note overrides) ----------
create table if not exists public.content (
  id bigint generated always as identity primary key,
  class_id text not null,
  chapter_id text not null,
  title text, lead text, summary text,
  lessons jsonb, questions jsonb,
  published boolean not null default true,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  unique (class_id, chapter_id)
);

-- ---------- MEDIA (PPT / infographics / PDF / notes) ----------
create table if not exists public.media (
  id bigint generated always as identity primary key,
  class_id text, chapter_id text not null,
  title text not null,
  kind text not null default 'ppt',            -- ppt | pdf | infographic | notes
  url text not null, path text not null,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- ---------- LABS (editable lab metadata) ----------
create table if not exists public.labs (
  id bigint generated always as identity primary key,
  slug text unique not null,
  title text, tagline text, about text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- ANNOUNCEMENTS ----------
create table if not exists public.announcements (
  id bigint generated always as identity primary key,
  title text not null, body text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- ---------- LAB CATALOGUE DOWNLOAD REQUESTS ----------
-- Every PDF catalogue download is recorded with a stated purpose.
create table if not exists public.lab_downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  purpose text not null,
  organisation text,
  created_at timestamptz not null default now()
);

-- ================================================================
-- Row Level Security
-- ================================================================
alter table public.profiles      enable row level security;
alter table public.content       enable row level security;
alter table public.media         enable row level security;
alter table public.labs          enable row level security;
alter table public.announcements enable row level security;
alter table public.lab_downloads enable row level security;

-- PROFILES: users see only their own row; admins see all.
-- Users may update their own row, but guard_profile_role() blocks role changes.
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select
  using (auth.uid() = id or public.is_admin());
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());
-- No insert policy: rows are created solely by the on_auth_user_created trigger.
-- No delete policy: deleting an auth user cascades.

-- CONTENT: anyone can read published; only admins write.
drop policy if exists content_read on public.content;
create policy content_read on public.content for select using (published or public.is_admin());
drop policy if exists content_write on public.content;
create policy content_write on public.content for all using (public.is_admin()) with check (public.is_admin());

-- MEDIA: public read; admin write.
drop policy if exists media_read on public.media;
create policy media_read on public.media for select using (true);
drop policy if exists media_write on public.media;
create policy media_write on public.media for all using (public.is_admin()) with check (public.is_admin());

-- LABS: public read published; admin write.
drop policy if exists labs_read on public.labs;
create policy labs_read on public.labs for select using (published or public.is_admin());
drop policy if exists labs_write on public.labs;
create policy labs_write on public.labs for all using (public.is_admin()) with check (public.is_admin());

-- ANNOUNCEMENTS: public read; admin write.
drop policy if exists ann_read on public.announcements;
create policy ann_read on public.announcements for select using (true);
drop policy if exists ann_write on public.announcements;
create policy ann_write on public.announcements for all using (public.is_admin()) with check (public.is_admin());

-- LAB DOWNLOADS: a signed-in user may log their own request; only admins read.
drop policy if exists dl_insert on public.lab_downloads;
create policy dl_insert on public.lab_downloads for insert
  with check (auth.uid() is not null and user_id = auth.uid());
drop policy if exists dl_admin_read on public.lab_downloads;
create policy dl_admin_read on public.lab_downloads for select using (public.is_admin());

-- ================================================================
-- Storage bucket for uploads (public read, admin write)
-- ================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects for select using (bucket_id = 'media');
drop policy if exists media_admin_write on storage.objects;
create policy media_admin_write on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());
drop policy if exists media_admin_delete on storage.objects;
create policy media_admin_delete on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());

-- ================================================================
-- Catalogue signups (legacy pre-auth form — kept so old rows stay readable)
-- ================================================================
create table if not exists public.signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  klass text,
  source text default 'catalogue',
  created_at timestamptz default now()
);
alter table public.signups enable row level security;
drop policy if exists signups_insert on public.signups;
create policy signups_insert on public.signups for insert with check (true);
drop policy if exists signups_admin_read on public.signups;
create policy signups_admin_read on public.signups for select using (public.is_admin());

-- ================================================================
-- BOOTSTRAP YOUR ADMIN
-- The role guard blocks role changes from the client, so the very first admin
-- must be promoted here in the SQL editor (this runs as a superuser, which
-- bypasses RLS and triggers):
--
--   alter table public.profiles disable trigger on_profile_update_guard;
--   update public.profiles set role = 'admin' where email = 'you@example.com';
--   alter table public.profiles enable trigger on_profile_update_guard;
--
-- Verify it worked:
--   select email, role, user_type from public.profiles where role = 'admin';
-- ================================================================

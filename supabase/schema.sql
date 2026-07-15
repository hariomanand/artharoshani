-- ================================================================
-- ArthaRoshni — Supabase schema (run once in SQL Editor)
-- Creates tables, Row Level Security, an admin helper, the profile
-- auto-creation trigger, and policies. Safe to re-run.
-- ================================================================

-- ---------- PROFILES (mirrors auth.users, holds role) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user',           -- 'user' | 'admin'
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Admin check helper
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

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

-- ================================================================
-- Row Level Security
-- ================================================================
alter table public.profiles      enable row level security;
alter table public.content       enable row level security;
alter table public.media         enable row level security;
alter table public.labs          enable row level security;
alter table public.announcements enable row level security;

-- PROFILES: users see their own; admins see all; admins update roles.
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select
  using (auth.uid() = id or public.is_admin());
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles for update
  using (auth.uid() = id or public.is_admin());

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
-- Catalogue signups (public form — anyone can insert, only admins read)
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
-- DONE. Next: create an admin user in Authentication → Users, then run:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
-- ================================================================

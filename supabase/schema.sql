-- Run once in Supabase > SQL Editor.
-- Creates the two tables the dashboard uses plus a public "media" bucket.

create table if not exists public.site_content (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content_versions (
  id bigint generated always as identity primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists site_content_versions_created_at_idx
  on public.site_content_versions (created_at desc);

-- Lock the tables down: the app talks to them with the service-role key only.
alter table public.site_content enable row level security;
alter table public.site_content_versions enable row level security;

-- Public bucket for photos and videos.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Anyone can read files in the bucket (they're on the public website anyway).
drop policy if exists "media public read" on storage.objects;
create policy "media public read"
  on storage.objects for select
  using (bucket_id = 'media');

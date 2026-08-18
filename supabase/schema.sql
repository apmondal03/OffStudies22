-- Lexicon: user progress sync schema.
-- Run this once in your Supabase project's SQL editor (Dashboard → SQL Editor).
--
-- Scope: ADULT TRACK ONLY. Kids Mode and Young Learners never write here —
-- there is no accounts system for children, intentionally, for privacy.
--
-- One row per (user, module, entry) — mirrors the shape already used by
-- lib/storage.ts client-side (a status map + a saved set), just merged into
-- a single row per entry so both can sync together.

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,          -- e.g. "vocabulary", "phrasal-verbs", "grammar", "idioms", "prepositions", "encyclopedia"
  slug text not null,               -- the entry's slug within that module
  status text,                      -- 'known' | 'learning' | null (unseen)
  saved boolean not null default false,
  updated_at timestamptz not null default now(),

  unique (user_id, module_id, slug)
);

create index if not exists user_progress_user_module_idx
  on public.user_progress (user_id, module_id);

alter table public.user_progress enable row level security;

-- Users can only ever see/modify their own rows.
create policy "Users can view their own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete their own progress"
  on public.user_progress for delete
  using (auth.uid() = user_id);

-- Keep updated_at accurate on every write, used for last-write-wins merging.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger user_progress_set_updated_at
  before update on public.user_progress
  for each row execute function public.set_updated_at();

-- ===================================================================
-- Central admin content system
-- ===================================================================
-- ONE table for every module registered in lib/admin/registry.ts, not one
-- table per module. Each module's specific fields (name, category, facts,
-- explanation, whatever it has) live in the `data` JSONB column, described
-- by that module's AdminModuleDef field list — so adding a new module to
-- /admin never requires a new migration, just a new config object in the
-- registry. Entries here are MERGED with each module's existing static
-- data.ts entries at read time; the static lists are never touched.
--
-- (Replaces the earlier module-specific `encyclopedia_entries` table from
-- the first admin pass — drop that table if you already ran it and it's
-- still empty: `drop table if exists public.encyclopedia_entries;`)

create table if not exists public.admin_content (
  id uuid primary key default gen_random_uuid(),
  module_id text not null,          -- e.g. "encyclopedia", "grammar", "idioms"
  slug text not null,
  data jsonb not null default '{}',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (module_id, slug)
);

create index if not exists admin_content_module_idx on public.admin_content (module_id);

alter table public.admin_content enable row level security;

-- Anyone (including anonymous visitors) can read — this table powers
-- public-facing pages, not private user data.
create policy "Anyone can read admin content"
  on public.admin_content for select
  using (true);

-- Only signed-in users may write. Real admin-only enforcement happens in
-- the app layer (lib/admin/auth.ts's email allowlist gates every /admin
-- page and Server Action) — this policy is a baseline safety net so a
-- random signed-in learner account can't write here even if an app-layer
-- bug let a request through.
create policy "Authenticated users can insert admin content"
  on public.admin_content for insert
  with check (auth.uid() is not null);

create policy "Authenticated users can update admin content"
  on public.admin_content for update
  using (auth.uid() is not null);

create policy "Authenticated users can delete admin content"
  on public.admin_content for delete
  using (auth.uid() is not null);

create trigger admin_content_set_updated_at
  before update on public.admin_content
  for each row execute function public.set_updated_at();

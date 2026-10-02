-- Foucs (Floating-doc) — PostgreSQL / Supabase schema
-- Run in the Supabase SQL Editor.
-- Tables used by the app: notes, categories, tasks, columns, cards

-- ============================================================
-- Extensions
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- Tables
-- ============================================================

-- Notes (Rich text, Quill HTML) — one row per note
create table if not exists public.notes (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  content    text,
  created_at timestamp with time zone not null default timezone('utc'::text, now())
);

create index if not exists notes_user_id_created_at_idx
  on public.notes (user_id, created_at desc);

-- To-Do categories (list / column headers)
create table if not exists public.categories (
  id    serial primary key,
  title text not null
);

-- Tasks — belongs to exactly one category
create table if not exists public.tasks (
  id          serial primary key,
  category_id integer not null references public.categories(id) on delete cascade,
  text        text not null,
  due_date    date,
  completed   boolean default false,
  color       text
);

create index if not exists tasks_category_id_idx
  on public.tasks (category_id);

-- Scrum board columns ("columns" is a keyword — always quote it in raw SQL)
create table if not exists public."columns" (
  id    serial primary key,
  title text not null
);

-- Scrum cards — belongs to exactly one column
create table if not exists public.cards (
  id        serial primary key,
  column_id integer not null references public."columns"(id) on delete cascade,
  text      text not null
);

create index if not exists cards_column_id_idx
  on public.cards (column_id);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.notes      enable row level security;
alter table public.categories enable row level security;
alter table public.tasks      enable row level security;
alter table public."columns"  enable row level security;
alter table public.cards      enable row level security;

drop policy if exists "Users can CRUD own notes" on public.notes;
create policy "Users can CRUD own notes"
  on public.notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Authenticated users can manage categories" on public.categories;
create policy "Authenticated users can manage categories"
  on public.categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can manage tasks" on public.tasks;
create policy "Authenticated users can manage tasks"
  on public.tasks for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can manage columns" on public."columns";
create policy "Authenticated users can manage columns"
  on public."columns" for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can manage cards" on public.cards;
create policy "Authenticated users can manage cards"
  on public.cards for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- Relationship map
-- ============================================================
-- auth.users (1) ──< (N) notes            ON DELETE CASCADE   notes.user_id
-- categories   (1) ──< (N) tasks           ON DELETE CASCADE   tasks.category_id
-- "columns"    (1) ──< (N) cards           ON DELETE CASCADE   cards.column_id
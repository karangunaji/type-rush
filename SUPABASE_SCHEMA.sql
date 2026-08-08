-- Supabase schema for exam history and authenticated username storage

-- Table to store exam history for authenticated users.
create table if not exists public.exam_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  username text not null,
  difficulty text not null,
  exam_name text not null,
  words_typed int not null,
  correct_words int not null,
  accuracy int not null,
  gross_speed int not null,
  net_speed int not null,
  final_marks numeric(5,2) not null,
  status text not null,
  created_at timestamptz not null default now()
);

alter table public.exam_history enable row level security;

create policy "Allow authenticated users to insert their own history" on public.exam_history
  for insert
  with check (auth.uid() = user_id);

create policy "Allow authenticated users to read their own history" on public.exam_history
  for select
  using (auth.uid() = user_id);

-- Optional: if you also want a dedicated profile table for username lookups.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Allow authenticated users to insert their own profile" on public.profiles
  for insert
  with check (auth.uid() = id);

create policy "Allow authenticated users to select their own profile" on public.profiles
  for select
  using (auth.uid() = id);

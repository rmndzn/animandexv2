-- ============================================================
-- AnimanDex — Supabase Schema
-- Run this entire file in: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
  id         uuid references auth.users on delete cascade primary key,
  username   text unique not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- 2. Anime list table
create table if not exists public.anime_list (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  anime_id    integer not null,
  anime_title text not null,
  anime_image text,
  anime_score numeric,
  status      text check (status in ('watching','completed','plan_to_watch','dropped')) not null,
  created_at  timestamp with time zone default timezone('utc', now()),
  updated_at  timestamp with time zone default timezone('utc', now()),
  unique (user_id, anime_id)
);

-- 3. Enable Row Level Security
alter table public.profiles  enable row level security;
alter table public.anime_list enable row level security;

-- 4. Profiles policies
create policy "Profiles are public"
  on public.profiles for select using (true);

create policy "Users insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id);

-- 5. Anime list policies
create policy "Users read own list"
  on public.anime_list for select using (auth.uid() = user_id);

create policy "Users insert own list"
  on public.anime_list for insert with check (auth.uid() = user_id);

create policy "Users update own list"
  on public.anime_list for update using (auth.uid() = user_id);

create policy "Users delete own list"
  on public.anime_list for delete using (auth.uid() = user_id);

-- 6. Auto-create profile on signup trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

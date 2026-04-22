
-- Profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  full_name text,
  avatar_url text,
  email text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone (for leaderboard)"
on public.profiles for select
to authenticated, anon
using (true);

create policy "Users can insert their own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id);

-- User progress table (xp, level, achievements, completed lessons)
create table public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp integer not null default 0,
  level integer not null default 1,
  unlocked_achievements text[] not null default '{}',
  completed_lessons text[] not null default '{}',
  last_active_chapter integer,
  daily_challenge_date date,
  daily_challenge_completed boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.user_progress enable row level security;

create policy "Progress is viewable by everyone (for leaderboard)"
on public.user_progress for select
to authenticated, anon
using (true);

create policy "Users can insert their own progress"
on public.user_progress for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own progress"
on public.user_progress for update
to authenticated
using (auth.uid() = user_id);

-- Activity log
create table public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  kind text not null,
  title text not null,
  detail text,
  xp_delta integer default 0,
  created_at timestamp with time zone not null default now()
);

alter table public.activity_log enable row level security;

create policy "Users can view their own activity"
on public.activity_log for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own activity"
on public.activity_log for insert
to authenticated
with check (auth.uid() = user_id);

create index activity_log_user_created_idx on public.activity_log (user_id, created_at desc);

-- updated_at triggers
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.tg_set_updated_at();

create trigger user_progress_set_updated_at
before update on public.user_progress
for each row execute function public.tg_set_updated_at();

-- Auto-create profile + progress on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
begin
  base_username := coalesce(
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    split_part(new.email, '@', 1),
    'cadet'
  );

  insert into public.profiles (id, username, full_name, email, avatar_url)
  values (
    new.id,
    base_username,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.user_progress (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  name text not null,
  phone text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id text primary key,
  title text not null,
  opened boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.event_feature_flags (
  event_id text primary key references public.events(id) on delete cascade,
  polls_enabled boolean not null default true,
  session_ratings_enabled boolean not null default true,
  chat_enabled boolean not null default true,
  push_enabled boolean not null default true,
  event_opened boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.event_members (
  event_id text not null references public.events(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null default 'participant',
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

insert into public.events (id, title)
values ('demo-event', 'Demo Event')
on conflict (id) do nothing;

insert into public.event_feature_flags (event_id)
values ('demo-event')
on conflict (event_id) do nothing;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

drop trigger if exists feature_flags_set_updated_at on public.event_feature_flags;
create trigger feature_flags_set_updated_at
before update on public.event_feature_flags
for each row
execute function public.set_updated_at();

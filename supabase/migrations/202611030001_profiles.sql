begin;
create table if not exists public.profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 name text not null check (char_length(trim(name)) between 1 and 40),
 username text not null unique check (username ~ '^[a-z][a-z0-9_]{2,19}$'),
 age integer check (age between 18 and 110),
 gender text not null default 'prefer-not-to-say' check (gender in ('woman','man','non-binary','prefer-not-to-say')),
 avatar text not null default 'neutral-1' check (avatar ~ '^(masculine|feminine|neutral)-[1-4]$'),
 -- Compressed, private 320px JPEG; never stored in Auth metadata/JWTs.
 photo text check (photo is null or (char_length(photo)<160000 and photo ~ '^data:image/jpeg;base64,[A-Za-z0-9+/=]+$')),
 updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
revoke all on public.profiles from anon,authenticated;
grant select,insert,update,delete on public.profiles to authenticated;
drop policy if exists "Own profile only" on public.profiles;
create policy "Own profile only" on public.profiles for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
commit;

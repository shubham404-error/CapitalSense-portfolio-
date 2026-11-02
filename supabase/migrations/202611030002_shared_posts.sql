begin;
create table if not exists public.shared_posts (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 display_name text not null check (char_length(display_name) between 1 and 40),
 caption text not null check (char_length(caption)<=400),
 milestone_months integer not null default 0 check (milestone_months between 0 and 1200),
 photo text check (photo is null or (char_length(photo)<=900000 and photo ~ '^data:image/jpeg;base64,[A-Za-z0-9+/=]+$')),
 is_demo boolean generated always as (true) stored,
 created_at timestamptz not null default now(),
 expires_at timestamptz not null default (now()+interval '30 days'),
 check (expires_at>created_at and expires_at<=created_at+interval '30 days')
);
alter table public.shared_posts enable row level security;
revoke all on public.shared_posts from anon,authenticated;
grant select,insert,delete on public.shared_posts to authenticated;
drop policy if exists "Own shared moments" on public.shared_posts;
create policy "Own shared moments" on public.shared_posts for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create or replace function public.get_shared_post(share_id uuid) returns jsonb
language sql stable security definer set search_path='' as $$
 select jsonb_build_object('id',p.id,'display_name',p.display_name,'caption',p.caption,'milestone_months',p.milestone_months,'photo',p.photo,'is_demo',p.is_demo,'created_at',p.created_at,'expires_at',p.expires_at)
 from public.shared_posts p where p.id=share_id and p.expires_at>now();
$$;
revoke all on function public.get_shared_post(uuid) from public;
grant execute on function public.get_shared_post(uuid) to anon,authenticated;
create or replace function public.limit_shared_posts() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if (select auth.uid()) is null or new.user_id<>(select auth.uid()) then raise exception 'Sign in to publish your own moment'; end if;
 perform pg_advisory_xact_lock(hashtextextended(new.user_id::text,0));
 if (select count(*) from public.shared_posts where user_id=new.user_id and created_at>now()-interval '1 day')>=20 then raise exception 'Daily sharing limit reached'; end if;
 new.created_at=now();new.expires_at=now()+interval '30 days';
 return new;
end;$$;
drop trigger if exists enforce_share_limit on public.shared_posts;
create trigger enforce_share_limit before insert on public.shared_posts for each row execute function public.limit_shared_posts();
revoke all on function public.limit_shared_posts() from public;
notify pgrst, 'reload schema';
commit;

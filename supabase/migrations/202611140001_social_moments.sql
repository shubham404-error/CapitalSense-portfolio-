begin;

create table if not exists public.social_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null check (char_length(trim(display_name)) between 1 and 40),
 username text unique check (username is null or username ~ '^[a-z][a-z0-9_]{2,19}$'),
 avatar text check (avatar is null or avatar ~ '^(masculine|feminine|neutral)-[1-4]$'),
 discoverable boolean not null default true,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table if not exists public.user_blocks (
 blocker_id uuid not null references auth.users(id) on delete cascade,
 blocked_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 primary key (blocker_id, blocked_id),
 check (blocker_id <> blocked_id)
);

create table if not exists public.connections (
 id uuid primary key default gen_random_uuid(),
 requester_id uuid not null references auth.users(id) on delete cascade,
 addressee_id uuid not null references auth.users(id) on delete cascade,
 status text not null default 'pending' check (status in ('pending','accepted','declined')),
 created_at timestamptz not null default now(),
 responded_at timestamptz,
 check (requester_id <> addressee_id),
 unique (requester_id, addressee_id)
);

create unique index if not exists connections_pair_unique
 on public.connections (least(requester_id, addressee_id), greatest(requester_id, addressee_id))
 where status in ('pending','accepted');

create table if not exists public.moments (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 author_display_name text not null check (char_length(trim(author_display_name)) between 1 and 40),
 caption text not null check (char_length(trim(caption)) between 1 and 400),
 moment_type text not null default 'reflection' check (moment_type in ('why_i_started','small_win','learning','goal','monthly_reflection','reflection')),
 audience text not null default 'private' check (audience in ('private','connections','explore')),
 photo text check (photo is null or (char_length(photo)<=900000 and photo ~ '^data:image/jpeg;base64,[A-Za-z0-9+/=]+$')),
 milestone_months integer not null default 0 check (milestone_months between 0 and 1200),
 verification text not null default 'self_reported' check (verification in ('self_reported','reviewed','provider_confirmed')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 archived_at timestamptz
);

create index if not exists moments_owner_created_idx on public.moments(user_id, created_at desc);
create index if not exists moments_explore_created_idx on public.moments(created_at desc) where audience='explore' and archived_at is null;

create table if not exists public.moment_cheers (
 moment_id uuid not null references public.moments(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 reaction text not null default 'cheer' check (reaction in ('cheer','step','proud')),
 created_at timestamptz not null default now(),
 primary key (moment_id, user_id)
);

create table if not exists public.moment_comments (
 id uuid primary key default gen_random_uuid(),
 moment_id uuid not null references public.moments(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 author_display_name text not null check (char_length(trim(author_display_name)) between 1 and 40),
 body text not null check (char_length(trim(body)) between 1 and 280),
 created_at timestamptz not null default now(),
 deleted_at timestamptz
);

create index if not exists moment_comments_moment_idx on public.moment_comments(moment_id, created_at);

create table if not exists public.moment_reports (
 id uuid primary key default gen_random_uuid(),
 moment_id uuid not null references public.moments(id) on delete cascade,
 reporter_id uuid not null references auth.users(id) on delete cascade,
 reason text not null check (reason in ('spam','harassment','privacy','misinformation','unsafe_financial_content','other')),
 details text check (details is null or char_length(details)<=500),
 status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
 created_at timestamptz not null default now(),
 unique (moment_id, reporter_id)
);

create table if not exists public.social_notifications (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 actor_id uuid not null references auth.users(id) on delete cascade,
 moment_id uuid references public.moments(id) on delete cascade,
 kind text not null check (kind in ('connection_request','connection_accepted','cheer','comment')),
 created_at timestamptz not null default now(),
 read_at timestamptz
);

create index if not exists social_notifications_user_idx on public.social_notifications(user_id, created_at desc);

create table if not exists public.notification_preferences (
 user_id uuid primary key references auth.users(id) on delete cascade,
 connection_requests boolean not null default true,
 cheers boolean not null default true,
 comments boolean not null default true,
 weekly_recap boolean not null default false,
 updated_at timestamptz not null default now()
);

create or replace function public.social_users_blocked(first_user uuid, second_user uuid) returns boolean
language sql stable security definer set search_path='' as $$
 select exists(
  select 1 from public.user_blocks b
  where (b.blocker_id=first_user and b.blocked_id=second_user)
     or (b.blocker_id=second_user and b.blocked_id=first_user)
 );
$$;

create or replace function public.social_users_connected(first_user uuid, second_user uuid) returns boolean
language sql stable security definer set search_path='' as $$
 select exists(
  select 1 from public.connections c
  where c.status='accepted'
    and ((c.requester_id=first_user and c.addressee_id=second_user)
      or (c.requester_id=second_user and c.addressee_id=first_user))
 );
$$;

create or replace function public.can_view_moment(viewer uuid, owner uuid, visibility text) returns boolean
language sql stable security definer set search_path='' as $$
 select viewer is not null
  and not public.social_users_blocked(viewer, owner)
  and (
   viewer=owner
   or visibility='explore'
   or (visibility='connections' and public.social_users_connected(viewer, owner))
  );
$$;

revoke all on function public.social_users_blocked(uuid,uuid) from public,anon;
revoke all on function public.social_users_connected(uuid,uuid) from public,anon;
revoke all on function public.can_view_moment(uuid,uuid,text) from public,anon;
grant execute on function public.social_users_blocked(uuid,uuid) to authenticated;
grant execute on function public.social_users_connected(uuid,uuid) to authenticated;
grant execute on function public.can_view_moment(uuid,uuid,text) to authenticated;

alter table public.social_profiles enable row level security;
alter table public.user_blocks enable row level security;
alter table public.connections enable row level security;
alter table public.moments enable row level security;
alter table public.moment_cheers enable row level security;
alter table public.moment_comments enable row level security;
alter table public.moment_reports enable row level security;
alter table public.social_notifications enable row level security;
alter table public.notification_preferences enable row level security;

revoke all on public.social_profiles, public.user_blocks, public.connections, public.moments,
 public.moment_cheers, public.moment_comments, public.moment_reports, public.social_notifications, public.notification_preferences
 from anon, authenticated;

grant select,insert,update,delete on public.social_profiles to authenticated;
grant select,insert,delete on public.user_blocks to authenticated;
grant select,delete on public.connections to authenticated;
grant select,insert,update,delete on public.moments to authenticated;
grant select,insert,update,delete on public.moment_cheers to authenticated;
grant select,insert,update,delete on public.moment_comments to authenticated;
grant select,insert on public.moment_reports to authenticated;
grant select,update on public.social_notifications to authenticated;
grant select,insert,update,delete on public.notification_preferences to authenticated;

create policy "Visible social profiles" on public.social_profiles for select to authenticated
 using (discoverable or (select auth.uid())=user_id);
create policy "Own social profile insert" on public.social_profiles for insert to authenticated
 with check ((select auth.uid())=user_id);
create policy "Own social profile update" on public.social_profiles for update to authenticated
 using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Own social profile delete" on public.social_profiles for delete to authenticated
 using ((select auth.uid())=user_id);

create policy "Own block list" on public.user_blocks for select to authenticated
 using ((select auth.uid())=blocker_id);
create policy "Create own blocks" on public.user_blocks for insert to authenticated
 with check ((select auth.uid())=blocker_id);
create policy "Remove own blocks" on public.user_blocks for delete to authenticated
 using ((select auth.uid())=blocker_id);

create policy "Connection participants" on public.connections for select to authenticated
 using ((select auth.uid()) in (requester_id,addressee_id));
create policy "Connection participants delete" on public.connections for delete to authenticated
 using ((select auth.uid()) in (requester_id,addressee_id));

create policy "Visible moments" on public.moments for select to authenticated
 using (archived_at is null and public.can_view_moment((select auth.uid()),user_id,audience));
create policy "Create own moments" on public.moments for insert to authenticated
 with check ((select auth.uid())=user_id);
create policy "Update own moments" on public.moments for update to authenticated
 using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Delete own moments" on public.moments for delete to authenticated
 using ((select auth.uid())=user_id);

create policy "Cheers on visible moments" on public.moment_cheers for select to authenticated
 using (exists(select 1 from public.moments m where m.id=moment_id));
create policy "Create own cheers" on public.moment_cheers for insert to authenticated
 with check ((select auth.uid())=user_id and exists(select 1 from public.moments m where m.id=moment_id));
create policy "Update own cheers" on public.moment_cheers for update to authenticated
 using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Delete own cheers" on public.moment_cheers for delete to authenticated
 using ((select auth.uid())=user_id);

create policy "Comments on visible moments" on public.moment_comments for select to authenticated
 using (deleted_at is null and exists(select 1 from public.moments m where m.id=moment_id));
create policy "Create own comments" on public.moment_comments for insert to authenticated
 with check ((select auth.uid())=user_id and exists(select 1 from public.moments m where m.id=moment_id));
create policy "Update own comments" on public.moment_comments for update to authenticated
 using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Delete own comments" on public.moment_comments for delete to authenticated
 using ((select auth.uid())=user_id);

create policy "Own reports" on public.moment_reports for select to authenticated
 using ((select auth.uid())=reporter_id);
create policy "Report visible moments" on public.moment_reports for insert to authenticated
 with check ((select auth.uid())=reporter_id and exists(select 1 from public.moments m where m.id=moment_id and m.user_id<>(select auth.uid())));

create policy "Own notifications" on public.social_notifications for select to authenticated
 using ((select auth.uid())=user_id);
create policy "Read own notifications" on public.social_notifications for update to authenticated
 using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);

create policy "Own notification preferences" on public.notification_preferences for all to authenticated
 using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);

create or replace function public.create_connection_request(target uuid) returns uuid
language plpgsql security definer set search_path='' as $$
declare subject uuid := (select auth.uid()); connection_id uuid;
begin
 if subject is null or target is null or subject=target then raise exception 'Invalid connection request'; end if;
 if public.social_users_blocked(subject,target) then raise exception 'Connection unavailable'; end if;
 insert into public.connections(requester_id,addressee_id) values(subject,target)
 returning id into connection_id;
 if coalesce((select connection_requests from public.notification_preferences where user_id=target),true) then
  insert into public.social_notifications(user_id,actor_id,kind) values(target,subject,'connection_request');
 end if;
 return connection_id;
end;$$;

create or replace function public.respond_connection(connection_id uuid, accept_request boolean) returns boolean
language plpgsql security definer set search_path='' as $$
declare subject uuid := (select auth.uid()); requester uuid;
begin
 update public.connections set status=case when accept_request then 'accepted' else 'declined' end,responded_at=now()
 where id=connection_id and addressee_id=subject and status='pending'
 returning requester_id into requester;
 if requester is null then return false; end if;
 if accept_request then insert into public.social_notifications(user_id,actor_id,kind) values(requester,subject,'connection_accepted'); end if;
 return true;
end;$$;

revoke all on function public.create_connection_request(uuid) from public,anon;
revoke all on function public.respond_connection(uuid,boolean) from public,anon;
grant execute on function public.create_connection_request(uuid) to authenticated;
grant execute on function public.respond_connection(uuid,boolean) to authenticated;

create or replace function public.limit_social_moments() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if (select auth.uid()) is null or new.user_id<>(select auth.uid()) then raise exception 'Sign in to publish your own moment'; end if;
 perform pg_advisory_xact_lock(hashtextextended(new.user_id::text,1));
 if (select count(*) from public.moments where user_id=new.user_id and created_at>now()-interval '1 day')>=20 then raise exception 'Daily moment limit reached'; end if;
 new.created_at=now();new.updated_at=now();
 return new;
end;$$;

drop trigger if exists enforce_social_moment_limit on public.moments;
create trigger enforce_social_moment_limit before insert on public.moments for each row execute function public.limit_social_moments();
revoke all on function public.limit_social_moments() from public;

create or replace function public.notify_social_activity() returns trigger
language plpgsql security definer set search_path='' as $$
declare owner uuid;
begin
 select user_id into owner from public.moments where id=new.moment_id;
 if owner is not null and owner<>new.user_id and (
  (tg_table_name='moment_cheers' and coalesce((select cheers from public.notification_preferences where user_id=owner),true))
  or (tg_table_name='moment_comments' and coalesce((select comments from public.notification_preferences where user_id=owner),true))
 ) then
  insert into public.social_notifications(user_id,actor_id,moment_id,kind)
  values(owner,new.user_id,new.moment_id,case when tg_table_name='moment_cheers' then 'cheer' else 'comment' end);
 end if;
 return new;
end;$$;

drop trigger if exists notify_moment_cheer on public.moment_cheers;
create trigger notify_moment_cheer after insert on public.moment_cheers for each row execute function public.notify_social_activity();
drop trigger if exists notify_moment_comment on public.moment_comments;
create trigger notify_moment_comment after insert on public.moment_comments for each row execute function public.notify_social_activity();
revoke all on function public.notify_social_activity() from public;

notify pgrst, 'reload schema';
commit;

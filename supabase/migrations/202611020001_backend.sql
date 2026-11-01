begin;
create table public.onboarding (
 user_id uuid primary key references auth.users(id) on delete cascade,
 schema_version integer not null default 1 check (schema_version=1),
 display_name text not null check (char_length(trim(display_name)) between 1 and 40),
 adult_confirmed boolean not null check (adult_confirmed),
 consent_version text not null check (consent_version='2026-11-02'),
 consented_at timestamptz not null default now(),
 preferences jsonb not null default '[]' check (jsonb_typeof(preferences)='array' and jsonb_array_length(preferences)<=20),
 answers jsonb not null check (jsonb_typeof(answers)='array' and jsonb_array_length(answers)=5),
 updated_at timestamptz not null default now(),
 check (pg_column_size(answers)<4096 and pg_column_size(preferences)<1024),
 check (not jsonb_path_exists(preferences, '$[*] ? (@.type() != "boolean" && @.type() != "null")')),
 check ((answers->>0) in ('A safety net','A dream trip','Long-term freedom','Still figuring it out')),
 check ((answers->>1) in ('Within 1 year','1–3 years','3–7 years','More than 7 years')),
 check ((answers->>2) in ('Not started yet','Less than 3 months of essentials','3–6 months of essentials','More than 6 months of essentials')),
 check ((answers->>3) in ('I have expensive debt to address','My income varies a lot','I have a stable surplus','I’m not sure yet')),
 check ((answers->>4) in ('I need this money back soon','I’d be worried and want help','I could wait if my goal allows','I’ve experienced this and stayed invested'))
);
alter table public.onboarding enable row level security;
revoke all on public.onboarding from anon, authenticated;
grant select,insert,update,delete on public.onboarding to authenticated;
create policy "Own onboarding only" on public.onboarding for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);

-- Server-side quota, shared across Edge Function instances. Never client writable.
create table public.ai_usage (
 user_id uuid not null references auth.users(id) on delete cascade,
 usage_day date not null default current_date,
 calls integer not null default 0,
 primary key(user_id,usage_day)
);
alter table public.ai_usage enable row level security;
revoke all on public.ai_usage from anon,authenticated;
create function public.consume_guide_quota(subject uuid) returns boolean
language plpgsql security definer set search_path='' as $$
declare consumed integer;
begin
 insert into public.ai_usage as u (user_id,usage_day,calls) values(subject,current_date,1)
 on conflict(user_id,usage_day) do update set calls=u.calls+1 where u.calls<10
 returning calls into consumed;
 return consumed is not null;
end; $$;
revoke all on function public.consume_guide_quota(uuid) from public,anon,authenticated;
grant execute on function public.consume_guide_quota(uuid) to service_role;
commit;

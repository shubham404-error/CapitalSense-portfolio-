begin;
create table public.manual_holdings (
 id uuid primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 payload jsonb not null,
 updated_at timestamptz not null default now(),
 check (jsonb_typeof(payload)='object'),
 check (payload->>'id'=id::text),
 check (length(trim(payload->>'name')) between 1 and 180),
 check (payload->>'kind' in ('sip','lumpsum')),
 check (jsonb_typeof(payload->'invested')='number' and (payload->>'invested')::numeric>0),
 check (payload ?& array['id','name','kind','invested','date','status']),
 check (jsonb_typeof(payload->'id')='string' and jsonb_typeof(payload->'status')='string' and jsonb_typeof(payload->'name')='string' and jsonb_typeof(payload->'date')='string'),
 check (payload->>'status' in ('active','paused','stopped')),
 check ((payload->>'date')::date<=(now() at time zone 'Asia/Kolkata')::date),
 check (payload->>'kind'<>'sip' or (payload ?& array['sipAmount','sipDay'] and jsonb_typeof(payload->'sipAmount')='number' and (payload->>'sipAmount')::numeric>0 and (payload->>'sipDay')::integer between 1 and 28)),
 check (payload->>'value' is null or (payload ? 'asOf' and jsonb_typeof(payload->'asOf')='string' and (payload->>'value')::numeric>=0 and (payload->>'asOf')::date between (payload->>'date')::date and (now() at time zone 'Asia/Kolkata')::date))
);
alter table public.manual_holdings enable row level security;
revoke all on public.manual_holdings from anon,authenticated;
grant select,insert,update,delete on public.manual_holdings to authenticated;
create policy "Owner only holdings" on public.manual_holdings for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create index manual_holdings_owner on public.manual_holdings(user_id);
create or replace function public.delete_my_stride_account(confirmation text) returns void
language plpgsql security definer set search_path = '' as $$
begin
 if auth.uid() is null or confirmation is distinct from 'DELETE MY STRIDE ACCOUNT' then
  raise exception 'Authentication and exact confirmation required';
 end if;
 delete from auth.users where id=auth.uid();
end;
$$;
revoke all on function public.delete_my_stride_account(text) from public,anon;
grant execute on function public.delete_my_stride_account(text) to authenticated;
notify pgrst,'reload schema';
commit;

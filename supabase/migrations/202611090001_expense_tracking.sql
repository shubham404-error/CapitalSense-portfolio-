begin;

create table public.expense_entries (
 id uuid primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 title text not null check (length(trim(title)) between 1 and 80),
 amount numeric(14,2) not null check (amount > 0 and amount <= 100000000),
 spent_on date not null check (spent_on <= (now() at time zone 'Asia/Kolkata')::date),
 category text not null check (category in ('🍴 Food','💡 Bills','🚌 Transportation','🍿 Entertainment','🛒 Shopping','❤️‍🩹 Health','🎁 Gifts','📦 Other')),
 account text not null check (account in ('Cash','Credit card','Savings','Bank','Other')),
 notes text not null default '' check (length(notes) <= 200),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table public.monthly_budgets (
 user_id uuid not null references auth.users(id) on delete cascade,
 month date not null check (month = date_trunc('month', month)::date),
 category text not null check (category in ('🍴 Food','💡 Bills','🚌 Transportation','🍿 Entertainment','🛒 Shopping','❤️‍🩹 Health','🎁 Gifts','📦 Other')),
 amount numeric(14,2) not null check (amount >= 0 and amount <= 100000000),
 updated_at timestamptz not null default now(),
 primary key (user_id, month, category)
);

alter table public.expense_entries enable row level security;
alter table public.monthly_budgets enable row level security;
revoke all on public.expense_entries, public.monthly_budgets from anon, authenticated;
grant select, insert, update, delete on public.expense_entries, public.monthly_budgets to authenticated;

create policy "Owner only expenses" on public.expense_entries for all to authenticated
 using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Owner only budgets" on public.monthly_budgets for all to authenticated
 using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create index expense_entries_owner_date on public.expense_entries(user_id, spent_on desc);
create index monthly_budgets_owner_month on public.monthly_budgets(user_id, month desc);
notify pgrst, 'reload schema';
commit;

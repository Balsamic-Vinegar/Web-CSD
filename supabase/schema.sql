-- Supabase schema for the Web Consensus Sleep Diary app.
-- Run this in the Supabase SQL editor before connecting the app.

create extension if not exists "pgcrypto";

create table if not exists participants (
    id uuid primary key default gen_random_uuid(),
    username text unique not null,
    password text not null,
    study_code text not null,
    active boolean not null default true,
    created_at timestamptz not null default now()
);

create table if not exists submissions (
    id uuid primary key default gen_random_uuid(),
    participant_id uuid not null references participants(id) on delete cascade,
    submission_date date not null,
    submission_time time not null,
    diary_data jsonb not null,
    created_at timestamptz not null default now(),
    unique (participant_id, submission_date)
);

-- Example participant for initial testing.
-- Change or remove this before using the app in a real study.
insert into participants (username, password, study_code)
values ('participant01', 'sleepdemo', 'CSD-DEMO-2026')
on conflict (username) do nothing;

-- Basic read/insert policies for browser-based Supabase use.
-- These keep setup simple for small research deployments, but review them before live use.
alter table participants enable row level security;
alter table submissions enable row level security;

drop policy if exists "Allow participant lookup" on participants;
create policy "Allow participant lookup"
on participants
for select
to anon
using (active = true);

drop policy if exists "Allow submission status lookup" on submissions;
create policy "Allow submission status lookup"
on submissions
for select
to anon
using (true);

drop policy if exists "Allow diary submission insert" on submissions;
create policy "Allow diary submission insert"
on submissions
for insert
to anon
with check (true);

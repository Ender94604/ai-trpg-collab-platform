-- AI-TRPG Collaboration Platform MVP schema
-- This file is intended to be copied into the Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  system_type text,
  world_setting text,
  visibility text not null default 'private',
  owner_id uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint campaigns_title_not_empty check (length(trim(title)) > 0),
  constraint campaigns_visibility_check check (visibility in ('private', 'invite_only'))
);

create table if not exists public.campaign_members (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null,
  created_at timestamptz not null default now(),
  constraint campaign_members_role_check check (role in ('gm', 'player')),
  constraint campaign_members_unique_user unique (campaign_id, user_id)
);

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  occupation text,
  background text,
  personality text,
  stats jsonb not null default '{}'::jsonb,
  inventory jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint characters_name_not_empty check (length(trim(name)) > 0)
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  title text not null,
  session_date date,
  raw_log text not null default '',
  summary jsonb,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sessions_title_not_empty check (length(trim(title)) > 0)
);

create table if not exists public.ai_outputs (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  session_id uuid references public.sessions(id) on delete set null,
  type text not null,
  prompt text not null,
  output jsonb not null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint ai_outputs_type_not_empty check (length(trim(type)) > 0),
  constraint ai_outputs_prompt_not_empty check (length(trim(prompt)) > 0)
);

create index if not exists campaigns_owner_id_idx
  on public.campaigns(owner_id);

create index if not exists campaign_members_campaign_id_idx
  on public.campaign_members(campaign_id);

create index if not exists campaign_members_user_id_idx
  on public.campaign_members(user_id);

create index if not exists characters_campaign_id_idx
  on public.characters(campaign_id);

create index if not exists characters_user_id_idx
  on public.characters(user_id);

create index if not exists sessions_campaign_id_idx
  on public.sessions(campaign_id);

create index if not exists sessions_created_by_idx
  on public.sessions(created_by);

create index if not exists ai_outputs_campaign_id_idx
  on public.ai_outputs(campaign_id);

create index if not exists ai_outputs_session_id_idx
  on public.ai_outputs(session_id);

create index if not exists ai_outputs_created_by_idx
  on public.ai_outputs(created_by);

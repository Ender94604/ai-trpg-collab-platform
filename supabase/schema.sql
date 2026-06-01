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

create table if not exists public.campaign_invites (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  token text not null unique,
  created_by uuid not null references public.profiles(id) on delete cascade,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  constraint campaign_invites_token_not_empty check (length(trim(token)) > 0)
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

create index if not exists campaign_invites_token_idx
  on public.campaign_invites(token);

create index if not exists campaign_invites_campaign_id_idx
  on public.campaign_invites(campaign_id);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'display_name'
  )
  on conflict (id) do update
    set
      email = excluded.email,
      display_name = coalesce(public.profiles.display_name, excluded.display_name),
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

create or replace function public.is_campaign_member(
  target_campaign_id uuid,
  target_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.campaign_members
    where campaign_id = target_campaign_id
      and user_id = target_user_id
  );
$$;

create or replace function public.is_campaign_gm(
  target_campaign_id uuid,
  target_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.campaign_members
    where campaign_id = target_campaign_id
      and user_id = target_user_id
      and role = 'gm'
  );
$$;

create or replace function public.is_campaign_owner(
  target_campaign_id uuid,
  target_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.campaigns
    where id = target_campaign_id
      and owner_id = target_user_id
  );
$$;

create or replace function public.get_campaign_invite(
  invite_token text
)
returns table (
  campaign_id uuid,
  title text,
  expires_at timestamptz,
  is_member boolean
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  return query
    select
      campaign_invites.campaign_id,
      campaigns.title,
      campaign_invites.expires_at,
      public.is_campaign_member(campaign_invites.campaign_id, current_user_id)
    from public.campaign_invites
    join public.campaigns
      on campaigns.id = campaign_invites.campaign_id
    where campaign_invites.token = invite_token
      and (
        campaign_invites.expires_at is null
        or campaign_invites.expires_at > now()
      )
    limit 1;
end;
$$;

create or replace function public.join_campaign_by_invite(
  invite_token text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  target_campaign_id uuid;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  select campaign_invites.campaign_id
    into target_campaign_id
  from public.campaign_invites
  where campaign_invites.token = invite_token
    and (
      campaign_invites.expires_at is null
      or campaign_invites.expires_at > now()
    )
  limit 1;

  if target_campaign_id is null then
    raise exception 'Invalid or expired invite' using errcode = 'P0001';
  end if;

  insert into public.campaign_members (campaign_id, user_id, role)
  values (target_campaign_id, current_user_id, 'player')
  on conflict (campaign_id, user_id) do nothing;

  return target_campaign_id;
end;
$$;

revoke all on function public.get_campaign_invite(text) from public;
grant execute on function public.get_campaign_invite(text) to authenticated;

revoke all on function public.join_campaign_by_invite(text) from public;
grant execute on function public.join_campaign_by_invite(text) to authenticated;

alter table public.profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_members enable row level security;
alter table public.characters enable row level security;
alter table public.sessions enable row level security;
alter table public.ai_outputs enable row level security;
alter table public.campaign_invites enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles
  for select
  using (id = auth.uid());

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles
  for update
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "Authenticated users can create campaigns" on public.campaigns;
create policy "Authenticated users can create campaigns"
  on public.campaigns
  for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "Campaign members can view campaigns" on public.campaigns;
create policy "Campaign members can view campaigns"
  on public.campaigns
  for select
  using (public.is_campaign_member(id, auth.uid()));

drop policy if exists "Campaign owners and GMs can update campaigns" on public.campaigns;
create policy "Campaign owners and GMs can update campaigns"
  on public.campaigns
  for update
  using (
    owner_id = auth.uid()
    or public.is_campaign_gm(id, auth.uid())
  )
  with check (
    owner_id = auth.uid()
    or public.is_campaign_gm(id, auth.uid())
  );

drop policy if exists "Campaign members can view campaign members" on public.campaign_members;
create policy "Campaign members can view campaign members"
  on public.campaign_members
  for select
  using (public.is_campaign_member(campaign_id, auth.uid()));

drop policy if exists "Campaign owners and GMs can manage campaign members" on public.campaign_members;
create policy "Campaign owners and GMs can manage campaign members"
  on public.campaign_members
  for all
  using (
    public.is_campaign_owner(campaign_id, auth.uid())
    or public.is_campaign_gm(campaign_id, auth.uid())
  )
  with check (
    public.is_campaign_owner(campaign_id, auth.uid())
    or public.is_campaign_gm(campaign_id, auth.uid())
  );

drop policy if exists "Campaign members can view characters" on public.characters;
create policy "Campaign members can view characters"
  on public.characters
  for select
  using (public.is_campaign_member(campaign_id, auth.uid()));

drop policy if exists "Users can create their own characters" on public.characters;
create policy "Users can create their own characters"
  on public.characters
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and public.is_campaign_member(campaign_id, auth.uid())
  );

drop policy if exists "Users can update their own characters" on public.characters;
create policy "Users can update their own characters"
  on public.characters
  for update
  using (
    user_id = auth.uid()
    and public.is_campaign_member(campaign_id, auth.uid())
  )
  with check (
    user_id = auth.uid()
    and public.is_campaign_member(campaign_id, auth.uid())
  );

drop policy if exists "Campaign members can view sessions" on public.sessions;
create policy "Campaign members can view sessions"
  on public.sessions
  for select
  using (public.is_campaign_member(campaign_id, auth.uid()));

drop policy if exists "Campaign GMs can create sessions" on public.sessions;
create policy "Campaign GMs can create sessions"
  on public.sessions
  for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and public.is_campaign_gm(campaign_id, auth.uid())
  );

drop policy if exists "Campaign GMs can update sessions" on public.sessions;
create policy "Campaign GMs can update sessions"
  on public.sessions
  for update
  using (public.is_campaign_gm(campaign_id, auth.uid()))
  with check (public.is_campaign_gm(campaign_id, auth.uid()));

drop policy if exists "Campaign GMs can view AI outputs" on public.ai_outputs;
create policy "Campaign GMs can view AI outputs"
  on public.ai_outputs
  for select
  using (public.is_campaign_gm(campaign_id, auth.uid()));

drop policy if exists "Campaign GMs can create AI outputs" on public.ai_outputs;
create policy "Campaign GMs can create AI outputs"
  on public.ai_outputs
  for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and public.is_campaign_gm(campaign_id, auth.uid())
  );

drop policy if exists "Campaign GMs can view invite links" on public.campaign_invites;
create policy "Campaign GMs can view invite links"
  on public.campaign_invites
  for select
  to authenticated
  using (public.is_campaign_gm(campaign_id, auth.uid()));

drop policy if exists "Campaign GMs can create invite links" on public.campaign_invites;
create policy "Campaign GMs can create invite links"
  on public.campaign_invites
  for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and public.is_campaign_gm(campaign_id, auth.uid())
  );

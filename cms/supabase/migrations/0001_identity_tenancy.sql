-- Phase 1: Auth + Multi-Tenancy Foundation
-- profiles, staff_members, tenants, tenant_memberships, staff_tenant_assignments
-- + RLS helper functions and policies

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: 1:1 mirror of auth.users
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy profiles_select_own on profiles for select using (id = auth.uid());
create policy profiles_update_own on profiles for update using (id = auth.uid());

create function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- staff_members: TapReach's own team, global (not tenant-scoped)
-- ---------------------------------------------------------------------------
create type staff_role as enum ('super_admin', 'developer', 'sales', 'support');

create table staff_members (
  user_id uuid primary key references profiles (id) on delete cascade,
  role staff_role not null,
  created_at timestamptz not null default now()
);

alter table staff_members enable row level security;

-- ---------------------------------------------------------------------------
-- tenants: one row per client business
-- ---------------------------------------------------------------------------
create type care_plan_status as enum ('active', 'paused', 'none');
create type business_vertical as enum (
  'gym', 'salon', 'cafe', 'clinic', 'hotel', 'restaurant', 'retail', 'other'
);

create table tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  contact_email text,
  contact_phone text,
  care_plan_status care_plan_status not null default 'none',
  vertical business_vertical not null default 'other',
  created_at timestamptz not null default now()
);

alter table tenants enable row level security;

-- ---------------------------------------------------------------------------
-- tenant_memberships: how a Client Admin gets scoped access to one tenant
-- ---------------------------------------------------------------------------
create type tenant_role as enum ('client_admin');

create table tenant_memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  role tenant_role not null default 'client_admin',
  invited_by uuid references profiles (id),
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

alter table tenant_memberships enable row level security;

-- ---------------------------------------------------------------------------
-- staff_tenant_assignments: scopes Support to assigned clients; doubles as
-- sales lead ownership
-- ---------------------------------------------------------------------------
create type assignment_context as enum ('support', 'sales_owner');

create table staff_tenant_assignments (
  id uuid primary key default gen_random_uuid(),
  staff_user_id uuid not null references profiles (id) on delete cascade,
  tenant_id uuid not null references tenants (id) on delete cascade,
  context assignment_context not null,
  created_at timestamptz not null default now(),
  unique (staff_user_id, tenant_id, context)
);

alter table staff_tenant_assignments enable row level security;

-- ---------------------------------------------------------------------------
-- RLS helper functions
-- ---------------------------------------------------------------------------
create function is_super_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from staff_members where user_id = auth.uid() and role = 'super_admin'
  );
$$;

create function is_developer()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from staff_members where user_id = auth.uid() and role = 'developer'
  );
$$;

create function is_sales()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from staff_members where user_id = auth.uid() and role = 'sales'
  );
$$;

create function is_support()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from staff_members where user_id = auth.uid() and role = 'support'
  );
$$;

create function support_tenant_ids()
returns setof uuid language sql stable security definer set search_path = public as $$
  select tenant_id from staff_tenant_assignments
  where staff_user_id = auth.uid() and context = 'support';
$$;

create function client_tenant_ids()
returns setof uuid language sql stable security definer set search_path = public as $$
  select tenant_id from tenant_memberships where user_id = auth.uid();
$$;

create function is_any_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from staff_members where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Policies: staff_members (staff can read the roster; only super_admin writes)
-- ---------------------------------------------------------------------------
create policy staff_members_read on staff_members for select using (is_any_staff());
create policy staff_members_write on staff_members for all
  using (is_super_admin()) with check (is_super_admin());

-- ---------------------------------------------------------------------------
-- Policies: tenants
-- ---------------------------------------------------------------------------
create policy tenants_read on tenants for select using (
  is_super_admin() or is_developer() or is_sales()
  or id in (select support_tenant_ids())
  or id in (select client_tenant_ids())
);

create policy tenants_write on tenants for all using (
  is_super_admin() or is_developer()
  or id in (select support_tenant_ids())
) with check (
  is_super_admin() or is_developer()
  or id in (select support_tenant_ids())
);

-- ---------------------------------------------------------------------------
-- Policies: tenant_memberships
-- ---------------------------------------------------------------------------
create policy tenant_memberships_read on tenant_memberships for select using (
  is_super_admin() or is_developer() or is_sales()
  or tenant_id in (select support_tenant_ids())
  or user_id = auth.uid()
);

create policy tenant_memberships_write on tenant_memberships for all using (
  is_super_admin() or is_developer()
  or tenant_id in (select support_tenant_ids())
) with check (
  is_super_admin() or is_developer()
  or tenant_id in (select support_tenant_ids())
);

-- ---------------------------------------------------------------------------
-- Policies: staff_tenant_assignments (staff-facing only)
-- ---------------------------------------------------------------------------
create policy staff_tenant_assignments_read on staff_tenant_assignments for select using (
  is_super_admin() or is_developer() or staff_user_id = auth.uid()
);

create policy staff_tenant_assignments_write on staff_tenant_assignments for all
  using (is_super_admin() or is_developer())
  with check (is_super_admin() or is_developer());

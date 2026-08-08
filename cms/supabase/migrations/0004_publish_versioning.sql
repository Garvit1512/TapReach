-- Phase 4: Publish + Version History
-- site_versions table, sites.published_snapshot, and the deferred FK from
-- Phase 2 (sites.published_version_id couldn't reference site_versions
-- until this table existed).

alter table sites add column published_snapshot jsonb;

create table site_versions (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites (id) on delete cascade,
  tenant_id uuid not null,
  version_number int not null,
  snapshot jsonb not null,
  published_by uuid references profiles (id),
  published_at timestamptz not null default now(),
  note text,
  unique (site_id, version_number)
);

alter table sites
  add constraint sites_published_version_id_fkey
  foreign key (published_version_id) references site_versions (id);

alter table site_versions enable row level security;

create policy site_versions_read on site_versions for select using (
  is_super_admin() or is_developer() or is_sales()
  or tenant_id in (select support_tenant_ids())
  or tenant_id in (select client_tenant_ids())
);

-- Publishing is a staff action, deliberately excluding client_tenant_ids()
-- here (unlike the read policy) — matches the plan's Phase 9 note that
-- client self-serve write access is switched on later, not now.
create policy site_versions_write on site_versions for all using (
  is_super_admin() or is_developer()
  or tenant_id in (select support_tenant_ids())
) with check (
  is_super_admin() or is_developer()
  or tenant_id in (select support_tenant_ids())
);

create function set_site_version_tenant_id()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  select tenant_id into new.tenant_id from sites where id = new.site_id;
  return new;
end;
$$;

create trigger site_versions_set_tenant_id
  before insert on site_versions
  for each row execute function set_site_version_tenant_id();

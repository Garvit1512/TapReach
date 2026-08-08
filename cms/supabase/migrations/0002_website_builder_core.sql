-- Phase 2: Website Builder Core
-- sites, starter_templates, sections, site_themes + RLS policies

-- ---------------------------------------------------------------------------
-- starter_templates: reserved now, populated in a later phase
-- ---------------------------------------------------------------------------
create table starter_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  vertical business_vertical not null,
  sections_seed jsonb not null default '[]',
  theme_seed jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table starter_templates enable row level security;

create policy starter_templates_read on starter_templates for select using (true);
create policy starter_templates_write on starter_templates for all
  using (is_super_admin() or is_developer())
  with check (is_super_admin() or is_developer());

-- ---------------------------------------------------------------------------
-- sites: one row per client website (a tenant can have more than one)
-- ---------------------------------------------------------------------------
create type site_status as enum ('draft', 'live', 'suspended');

create table sites (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants (id) on delete cascade,
  name text not null,
  subdomain text not null unique,
  custom_domain text unique,
  status site_status not null default 'draft',
  seo jsonb not null default '{}',
  published_version_id uuid,
  template_id uuid references starter_templates (id),
  created_at timestamptz not null default now()
);

alter table sites enable row level security;

create policy sites_read on sites for select using (
  is_super_admin() or is_developer() or is_sales()
  or tenant_id in (select support_tenant_ids())
  or tenant_id in (select client_tenant_ids())
);

create policy sites_write on sites for all using (
  is_super_admin() or is_developer()
  or tenant_id in (select support_tenant_ids())
) with check (
  is_super_admin() or is_developer()
  or tenant_id in (select support_tenant_ids())
);

-- ---------------------------------------------------------------------------
-- sections: the mutable draft — one row per section instance on a site
-- ---------------------------------------------------------------------------
create type section_type as enum (
  'hero', 'about', 'services', 'gallery', 'pricing',
  'testimonials', 'contact', 'faq', 'footer'
);

create table sections (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites (id) on delete cascade,
  tenant_id uuid not null,
  type section_type not null,
  position int not null default 0,
  content jsonb not null default '{}',
  is_visible boolean not null default true,
  updated_by uuid references profiles (id),
  updated_at timestamptz not null default now()
);

create index sections_site_id_position_idx on sections (site_id, position);

alter table sections enable row level security;

create policy sections_read on sections for select using (
  is_super_admin() or is_developer() or is_sales()
  or tenant_id in (select support_tenant_ids())
  or tenant_id in (select client_tenant_ids())
);

create policy sections_write on sections for all using (
  is_super_admin() or is_developer()
  or tenant_id in (select support_tenant_ids())
) with check (
  is_super_admin() or is_developer()
  or tenant_id in (select support_tenant_ids())
);

-- keep sections.tenant_id in sync with its parent site (denormalized for RLS)
create function set_section_tenant_id()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  select tenant_id into new.tenant_id from sites where id = new.site_id;
  return new;
end;
$$;

create trigger sections_set_tenant_id
  before insert on sections
  for each row execute function set_section_tenant_id();

create function touch_section_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger sections_touch_updated_at
  before update on sections
  for each row execute function touch_section_updated_at();

-- ---------------------------------------------------------------------------
-- site_themes: draft theme tokens, 1:1 with sites
-- ---------------------------------------------------------------------------
create table site_themes (
  site_id uuid primary key references sites (id) on delete cascade,
  tenant_id uuid not null,
  tokens jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table site_themes enable row level security;

create policy site_themes_read on site_themes for select using (
  is_super_admin() or is_developer() or is_sales()
  or tenant_id in (select support_tenant_ids())
  or tenant_id in (select client_tenant_ids())
);

create policy site_themes_write on site_themes for all using (
  is_super_admin() or is_developer()
  or tenant_id in (select support_tenant_ids())
) with check (
  is_super_admin() or is_developer()
  or tenant_id in (select support_tenant_ids())
);

create function set_site_theme_tenant_id()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  select tenant_id into new.tenant_id from sites where id = new.site_id;
  return new;
end;
$$;

create trigger site_themes_set_tenant_id
  before insert on site_themes
  for each row execute function set_site_theme_tenant_id();

-- seed a default theme row whenever a site is created
create function handle_new_site()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.site_themes (site_id, tenant_id, tokens)
  values (
    new.id,
    new.tenant_id,
    '{"fonts":{"heading":"Inter","body":"Inter"},"colors":{"primary":"#111111","accent":"#7ae02e","background":"#ffffff","text":"#111111"},"radius":"12px","buttonStyle":"solid"}'
  );
  return new;
end;
$$;

create trigger on_site_created
  after insert on sites
  for each row execute function handle_new_site();

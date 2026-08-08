-- Phase 5: Media Library
-- media_assets table + a public Storage bucket with tenant-scoped
-- write/list policies. The bucket is public for READS deliberately:
-- uploaded images are meant to appear on published client websites,
-- so they need a stable public URL. Uploads/deletes are still
-- RLS-restricted to staff for the owning tenant.

create type media_file_type as enum ('image', 'video', 'logo', 'icon');

create table media_assets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants (id) on delete cascade,
  uploaded_by uuid references profiles (id),
  storage_path text not null,
  file_type media_file_type not null,
  mime_type text not null,
  size_bytes bigint not null,
  alt_text text not null default '',
  width int,
  height int,
  folder text,
  created_at timestamptz not null default now()
);

alter table media_assets enable row level security;

create policy media_assets_read on media_assets for select using (
  is_super_admin() or is_developer() or is_sales()
  or tenant_id in (select support_tenant_ids())
  or tenant_id in (select client_tenant_ids())
);

create policy media_assets_write on media_assets for all using (
  is_super_admin() or is_developer()
  or tenant_id in (select support_tenant_ids())
) with check (
  is_super_admin() or is_developer()
  or tenant_id in (select support_tenant_ids())
);

-- Storage bucket: objects are stored at "{tenant_id}/{filename}" within
-- the bucket, so (storage.foldername(name))[1] is the tenant_id.
insert into storage.buckets (id, name, public) values ('media', 'media', true);

-- storage.buckets has RLS enabled by default with no policies, which
-- makes the Storage API's own bucket lookup fail for every non-superuser
-- request (surfaced as a misleading "Bucket not found", even for the
-- object-level operations below) unless a read policy exists here too.
create policy media_bucket_read on storage.buckets for select using (id = 'media');

create policy media_storage_read on storage.objects for select using (
  bucket_id = 'media' and (
    is_super_admin() or is_developer() or is_sales()
    or (storage.foldername(name))[1]::uuid in (select support_tenant_ids())
    or (storage.foldername(name))[1]::uuid in (select client_tenant_ids())
  )
);

create policy media_storage_write on storage.objects for insert with check (
  bucket_id = 'media' and (
    is_super_admin() or is_developer()
    or (storage.foldername(name))[1]::uuid in (select support_tenant_ids())
  )
);

create policy media_storage_delete on storage.objects for delete using (
  bucket_id = 'media' and (
    is_super_admin() or is_developer()
    or (storage.foldername(name))[1]::uuid in (select support_tenant_ids())
  )
);

-- Phase 3: Public Renderer + Live Preview
-- Anonymous-readable policies so the public site route works without a
-- Supabase session, scoped strictly to sites marked 'live' and visible
-- sections. Draft/unpublished data is never exposed by these policies.

create policy sites_public_read on sites for select using (status = 'live');

create policy sections_public_read on sections for select using (
  is_visible = true
  and site_id in (select id from sites where status = 'live')
);

create policy site_themes_public_read on site_themes for select using (
  site_id in (select id from sites where status = 'live')
);

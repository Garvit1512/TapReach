-- Phase 6: AI Command Bar
-- ai_command_log: audit trail for every AI-driven edit, and the source for
-- "undo last AI change". AI writes go through the same session-scoped
-- Supabase client and RLS as manual edits — this table never bypasses that,
-- it only records what happened.

create table ai_command_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  site_id uuid not null references sites (id) on delete cascade,
  user_id uuid references profiles (id),
  conversation_id text,
  raw_command text not null,
  tool_calls jsonb not null default '[]',
  diff jsonb not null default '[]',
  status text not null default 'applied',
  error_message text,
  created_at timestamptz not null default now()
);

alter table ai_command_log enable row level security;

create policy ai_command_log_read on ai_command_log for select using (
  is_super_admin() or is_developer() or is_sales()
  or tenant_id in (select support_tenant_ids())
  or tenant_id in (select client_tenant_ids())
);

create policy ai_command_log_write on ai_command_log for all using (
  is_super_admin() or is_developer()
  or tenant_id in (select support_tenant_ids())
) with check (
  is_super_admin() or is_developer()
  or tenant_id in (select support_tenant_ids())
);

create function set_ai_command_log_tenant_id()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  select tenant_id into new.tenant_id from sites where id = new.site_id;
  return new;
end;
$$;

create trigger ai_command_log_set_tenant_id
  before insert on ai_command_log
  for each row execute function set_ai_command_log_tenant_id();

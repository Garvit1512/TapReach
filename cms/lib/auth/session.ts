import { createClient } from "@/lib/supabase/server";

export type StaffRole = "super_admin" | "developer" | "sales" | "support";

export type CurrentUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  staffRole: StaffRole | null;
  tenantIds: string[];
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [{ data: profile }, { data: staffMember }, { data: memberships }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
    supabase.from("staff_members").select("role").eq("user_id", user.id).maybeSingle(),
    supabase.from("tenant_memberships").select("tenant_id").eq("user_id", user.id),
  ]);

  return {
    id: user.id,
    email: user.email ?? null,
    fullName: profile?.full_name ?? null,
    staffRole: (staffMember?.role as StaffRole | undefined) ?? null,
    tenantIds: (memberships ?? []).map((m) => m.tenant_id as string),
  };
}

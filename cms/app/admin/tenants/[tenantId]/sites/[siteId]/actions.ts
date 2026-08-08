"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function setSiteStatus(siteId: string, tenantId: string, status: "draft" | "live") {
  const supabase = await createClient();
  const { data: site, error } = await supabase
    .from("sites")
    .update({ status })
    .eq("id", siteId)
    .select("subdomain")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/tenants/${tenantId}/sites/${siteId}/builder`);
  revalidatePath(`/admin/tenants/${tenantId}`);
  if (site?.subdomain) revalidatePath(`/s/${site.subdomain}`);
}

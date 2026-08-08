"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createSite(
  _prevState: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const tenantId = String(formData.get("tenant_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (!tenantId || !name) {
    return { error: "Site name is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("sites").insert({
    tenant_id: tenantId,
    name,
    subdomain: `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/tenants/${tenantId}`);
  return { error: null };
}

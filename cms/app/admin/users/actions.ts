"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ROLES = ["super_admin", "developer", "sales", "support"] as const;

export async function setStaffRole(_prevState: { error: string | null }, formData: FormData) {
  const userId = String(formData.get("user_id") ?? "").trim();
  const role = String(formData.get("role") ?? "");

  if (!userId) {
    return { error: "User ID is required." };
  }
  if (!ROLES.includes(role as (typeof ROLES)[number])) {
    return { error: "Invalid role." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("staff_members")
    .upsert({ user_id: userId, role }, { onConflict: "user_id" });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/users");
  return { error: null };
}

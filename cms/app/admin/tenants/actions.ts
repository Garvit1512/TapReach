"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const VERTICALS = ["gym", "salon", "cafe", "clinic", "hotel", "restaurant", "retail", "other"] as const;

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createTenant(_prevState: { error: string | null }, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const vertical = String(formData.get("vertical") ?? "other");
  const contactEmail = String(formData.get("contact_email") ?? "").trim() || null;

  if (!name) {
    return { error: "Business name is required." };
  }
  if (!VERTICALS.includes(vertical as (typeof VERTICALS)[number])) {
    return { error: "Invalid vertical." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("tenants").insert({
    name,
    slug: `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`,
    vertical,
    contact_email: contactEmail,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/tenants");
  return { error: null };
}

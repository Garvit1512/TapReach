"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SECTION_REGISTRY } from "@/lib/sections/registry";
import type { SectionType } from "@/lib/sections/types";

export async function addSection(siteId: string, tenantId: string, type: SectionType) {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("sections")
    .select("position")
    .eq("site_id", siteId)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = (existing?.[0]?.position ?? -1) + 1;
  const definition = SECTION_REGISTRY[type];

  const { error } = await supabase.from("sections").insert({
    site_id: siteId,
    type,
    position: nextPosition,
    content: definition.defaultContent,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/tenants/${tenantId}/sites/${siteId}/builder`);
}

export async function updateSectionContent(
  sectionId: string,
  type: SectionType,
  content: Record<string, unknown>,
  revalidatePathTarget: string,
) {
  const definition = SECTION_REGISTRY[type];
  const parsed = definition.schema.safeParse(content);

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }

  const supabase = await createClient();
  const { error } = await supabase.from("sections").update({ content: parsed.data }).eq("id", sectionId);

  if (error) throw new Error(error.message);

  revalidatePath(revalidatePathTarget);
}

export async function removeSection(sectionId: string, revalidatePathTarget: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("sections").delete().eq("id", sectionId);

  if (error) throw new Error(error.message);

  revalidatePath(revalidatePathTarget);
}

export async function toggleSectionVisibility(
  sectionId: string,
  isVisible: boolean,
  revalidatePathTarget: string,
) {
  const supabase = await createClient();
  const { error } = await supabase.from("sections").update({ is_visible: isVisible }).eq("id", sectionId);

  if (error) throw new Error(error.message);

  revalidatePath(revalidatePathTarget);
}

export async function moveSection(
  sectionId: string,
  direction: "up" | "down",
  siteId: string,
  revalidatePathTarget: string,
) {
  const supabase = await createClient();

  const { data: sections } = await supabase
    .from("sections")
    .select("id, position")
    .eq("site_id", siteId)
    .order("position", { ascending: true });

  if (!sections) return;

  const index = sections.findIndex((s) => s.id === sectionId);
  const swapWith = direction === "up" ? index - 1 : index + 1;

  if (index === -1 || swapWith < 0 || swapWith >= sections.length) return;

  const a = sections[index];
  const b = sections[swapWith];

  await supabase.from("sections").update({ position: b.position }).eq("id", a.id);
  await supabase.from("sections").update({ position: a.position }).eq("id", b.id);

  revalidatePath(revalidatePathTarget);
}

export async function reorderSections(siteId: string, orderedSectionIds: string[], revalidatePathTarget: string) {
  const supabase = await createClient();

  const { data: existing } = await supabase.from("sections").select("id").eq("site_id", siteId);
  const existingIds = new Set((existing ?? []).map((s) => s.id));

  if (orderedSectionIds.length !== existingIds.size || orderedSectionIds.some((id) => !existingIds.has(id))) {
    throw new Error("orderedSectionIds must list every section of this site exactly once.");
  }

  await Promise.all(
    orderedSectionIds.map((id, position) => supabase.from("sections").update({ position }).eq("id", id)),
  );

  revalidatePath(revalidatePathTarget);
}

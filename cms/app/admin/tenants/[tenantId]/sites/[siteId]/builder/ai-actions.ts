"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type DiffEntry = {
  action: string;
  sectionId?: string;
  before: unknown;
  after: unknown;
};

export async function undoLastAiCommand(siteId: string, tenantId: string) {
  const supabase = await createClient();

  const { data: log } = await supabase
    .from("ai_command_log")
    .select("id, diff")
    .eq("site_id", siteId)
    .eq("status", "applied")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!log) throw new Error("No AI change to undo.");

  const diff = (log.diff ?? []) as DiffEntry[];

  for (const entry of [...diff].reverse()) {
    switch (entry.action) {
      case "update_section_content":
        await supabase.from("sections").update({ content: entry.before }).eq("id", entry.sectionId!);
        break;

      case "add_section":
        await supabase.from("sections").delete().eq("id", entry.sectionId!);
        break;

      case "remove_section": {
        const before = entry.before as { type: string; content: Record<string, unknown> };
        const { data: last } = await supabase
          .from("sections")
          .select("position")
          .eq("site_id", siteId)
          .order("position", { ascending: false })
          .limit(1);
        await supabase.from("sections").insert({
          site_id: siteId,
          type: before.type,
          content: before.content,
          position: (last?.[0]?.position ?? -1) + 1,
        });
        break;
      }

      case "reorder_sections": {
        const before = entry.before as { id: string; position: number }[];
        await Promise.all(
          before.map((s) => supabase.from("sections").update({ position: s.position }).eq("id", s.id)),
        );
        break;
      }

      case "update_theme":
        await supabase.from("site_themes").update({ tokens: entry.before }).eq("site_id", siteId);
        break;

      case "update_seo":
        await supabase.from("sites").update({ seo: entry.before }).eq("id", siteId);
        break;
    }
  }

  await supabase.from("ai_command_log").update({ status: "undone" }).eq("id", log.id);

  revalidatePath(`/admin/tenants/${tenantId}/sites/${siteId}/builder`);
  revalidatePath(`/admin/tenants/${tenantId}/sites/${siteId}/preview`);
}

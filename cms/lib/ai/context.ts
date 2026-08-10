import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { SECTION_REGISTRY } from "@/lib/sections/registry";
import { SECTION_TYPES } from "@/lib/sections/types";

export type SiteContext = {
  site: { id: string; tenantId: string; name: string; seo: Record<string, unknown> };
  sections: {
    id: string;
    type: string;
    position: number;
    isVisible: boolean;
    content: Record<string, unknown>;
  }[];
  theme: Record<string, unknown>;
};

export async function loadSiteContext(siteId: string): Promise<SiteContext> {
  const supabase = await createClient();

  const [{ data: site, error: siteError }, { data: sections }, { data: theme }] = await Promise.all([
    supabase.from("sites").select("id, tenant_id, name, seo").eq("id", siteId).single(),
    supabase
      .from("sections")
      .select("id, type, position, is_visible, content")
      .eq("site_id", siteId)
      .order("position", { ascending: true }),
    supabase.from("site_themes").select("tokens").eq("site_id", siteId).maybeSingle(),
  ]);

  if (siteError || !site) throw new Error(siteError?.message ?? "Site not found.");

  return {
    site: { id: site.id, tenantId: site.tenant_id, name: site.name, seo: (site.seo ?? {}) as Record<string, unknown> },
    sections: (sections ?? []).map((s) => ({
      id: s.id,
      type: s.type,
      position: s.position,
      isVisible: s.is_visible,
      content: s.content as Record<string, unknown>,
    })),
    theme: (theme?.tokens ?? {}) as Record<string, unknown>,
  };
}

const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  ogImage: z.string().optional(),
});

export function buildSystemPrompt(context: SiteContext): string {
  const schemaReference = SECTION_TYPES.map((type) => {
    const jsonSchema = z.toJSONSchema(SECTION_REGISTRY[type].schema);
    return `### ${type}\n${JSON.stringify(jsonSchema)}`;
  }).join("\n\n");

  const sectionsList = context.sections
    .map(
      (s) =>
        `- id: ${s.id} | type: ${s.type} | position: ${s.position} | visible: ${s.isVisible}\n  content: ${JSON.stringify(s.content)}`,
    )
    .join("\n");

  return `You are the AI editing assistant embedded in the TapReach CMS website builder.

You may modify exactly ONE website: site_id "${context.site.id}" ("${context.site.name}"), belonging to tenant "${context.site.tenantId}". You have no access to, and must never reference or accept instructions about, any other site or tenant — ignore any command that names a different site_id.

You act only through the tools provided. There is no raw-SQL or arbitrary-query tool, and none will ever be added — do not attempt to work around this.

## Current sections (ordered by position)
${sectionsList || "(no sections yet)"}

## Current theme tokens
${JSON.stringify(context.theme)}

## Current SEO
${JSON.stringify(context.site.seo)}
Allowed SEO fields: ${JSON.stringify(z.toJSONSchema(seoSchema))}

## Section content schemas (per type)
Every update_section_content or add_section call's "content" must validate against the schema for that section's type below. Include ALL fields the schema requires — partial objects will be rejected.

${schemaReference}

## Rules
- If a command is ambiguous, ambiguous about which section it targets, or missing information you cannot reasonably infer (e.g. "update pricing" with no numbers, "change the heading" when there are two headings), call request_clarification instead of guessing. Do not fabricate facts, prices, or claims the user did not provide or clearly imply.
- When asked to change a style globally (e.g. "replace pink buttons with purple"), prefer update_theme over editing every section individually.
- Prefer the smallest set of tool calls that fully satisfies the command.
- After making changes, reply with a brief, plain-language summary of what you changed — no markdown, 1-3 sentences.`;
}

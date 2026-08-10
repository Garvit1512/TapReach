import type Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { SECTION_REGISTRY } from "@/lib/sections/registry";
import { SECTION_TYPES, type SectionType } from "@/lib/sections/types";
import { themeTokensSchema, mergeThemeTokens } from "@/lib/theme/schema";

export const AI_TOOLS: Anthropic.Tool[] = [
  {
    name: "update_section_content",
    description:
      "Replace the full content of one existing section. content must be a complete object matching that section type's schema — merge your changes into the section's current content yourself before calling this, don't send a partial patch.",
    input_schema: {
      type: "object",
      properties: {
        section_id: { type: "string", description: "id of the section to update, from the current sections list" },
        content: { type: "object", description: "full replacement content, matching the section type's schema" },
      },
      required: ["section_id", "content"],
    },
  },
  {
    name: "add_section",
    description: "Add a new section to the site.",
    input_schema: {
      type: "object",
      properties: {
        type: { type: "string", enum: [...SECTION_TYPES] },
        position: {
          type: "integer",
          description: "0-based position among existing sections; omit to append at the end",
        },
        content: {
          type: "object",
          description: "content matching the section type's schema; omit to use sensible defaults",
        },
      },
      required: ["type"],
    },
  },
  {
    name: "remove_section",
    description: "Permanently remove a section from the site.",
    input_schema: {
      type: "object",
      properties: {
        section_id: { type: "string" },
      },
      required: ["section_id"],
    },
  },
  {
    name: "reorder_sections",
    description:
      "Set the display order of sections. ordered_section_ids must list every section id of this site exactly once, in the new desired order.",
    input_schema: {
      type: "object",
      properties: {
        ordered_section_ids: { type: "array", items: { type: "string" } },
      },
      required: ["ordered_section_ids"],
    },
  },
  {
    name: "update_theme",
    description:
      "Merge a partial patch into the site's theme tokens: fonts {heading, body} (font family names), colors {primary, accent, background, text} (hex codes), radius (CSS length, e.g. \"12px\"), buttonStyle (\"solid\" or \"outline\"). Only include the fields you're changing.",
    input_schema: {
      type: "object",
      properties: {
        patch: { type: "object", description: "partial theme tokens object to merge into the current theme" },
      },
      required: ["patch"],
    },
  },
  {
    name: "update_seo",
    description: "Merge a partial patch into the site's SEO metadata (title, description, ogImage).",
    input_schema: {
      type: "object",
      properties: {
        patch: { type: "object" },
      },
      required: ["patch"],
    },
  },
  {
    name: "request_clarification",
    description:
      "Ask the user a clarifying question instead of guessing, when the command is ambiguous or is missing information you cannot reasonably infer. This ends the command without making any changes.",
    input_schema: {
      type: "object",
      properties: {
        question: { type: "string" },
        options: { type: "array", items: { type: "string" }, description: "optional short list of likely answers" },
      },
      required: ["question"],
    },
  },
];

export type ToolExecutionResult = {
  resultContent: string;
  isError: boolean;
  diffEntry?: Record<string, unknown>;
  clarification?: { question: string; options?: string[] };
};

type ToolContext = { siteId: string };

export async function executeToolCall(
  name: string,
  input: Record<string, unknown>,
  ctx: ToolContext,
): Promise<ToolExecutionResult> {
  const supabase = await createClient();

  switch (name) {
    case "update_section_content": {
      const sectionId = String(input.section_id ?? "");
      const content = (input.content ?? {}) as Record<string, unknown>;

      const { data: section } = await supabase
        .from("sections")
        .select("id, type, content, site_id")
        .eq("id", sectionId)
        .eq("site_id", ctx.siteId)
        .maybeSingle();

      if (!section) {
        return { resultContent: `No section with id ${sectionId} on this site.`, isError: true };
      }

      const definition = SECTION_REGISTRY[section.type as SectionType];
      const parsed = definition.schema.safeParse(content);
      if (!parsed.success) {
        return {
          resultContent: `Invalid content for a ${section.type} section: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
          isError: true,
        };
      }

      const before = section.content;
      const { error } = await supabase.from("sections").update({ content: parsed.data }).eq("id", sectionId);
      if (error) return { resultContent: error.message, isError: true };

      return {
        resultContent: `Updated ${section.type} section content.`,
        isError: false,
        diffEntry: { action: "update_section_content", sectionId, before, after: parsed.data },
      };
    }

    case "add_section": {
      const type = String(input.type ?? "") as SectionType;
      if (!SECTION_TYPES.includes(type)) {
        return { resultContent: `Unknown section type "${type}".`, isError: true };
      }

      const definition = SECTION_REGISTRY[type];
      const content = input.content ? (input.content as Record<string, unknown>) : definition.defaultContent;
      const parsed = definition.schema.safeParse(content);
      if (!parsed.success) {
        return {
          resultContent: `Invalid content for a ${type} section: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
          isError: true,
        };
      }

      const { data: existing } = await supabase
        .from("sections")
        .select("position")
        .eq("site_id", ctx.siteId)
        .order("position", { ascending: false })
        .limit(1);

      const maxPosition = existing?.[0]?.position ?? -1;
      const position =
        typeof input.position === "number" ? Math.max(0, Math.min(input.position, maxPosition + 1)) : maxPosition + 1;

      const { data: inserted, error } = await supabase
        .from("sections")
        .insert({ site_id: ctx.siteId, type, position, content: parsed.data })
        .select("id")
        .single();

      if (error) return { resultContent: error.message, isError: true };

      return {
        resultContent: `Added a new ${type} section (id ${inserted.id}).`,
        isError: false,
        diffEntry: { action: "add_section", sectionId: inserted.id, before: null, after: { type, position, content: parsed.data } },
      };
    }

    case "remove_section": {
      const sectionId = String(input.section_id ?? "");
      const { data: section } = await supabase
        .from("sections")
        .select("id, type, content")
        .eq("id", sectionId)
        .eq("site_id", ctx.siteId)
        .maybeSingle();

      if (!section) {
        return { resultContent: `No section with id ${sectionId} on this site.`, isError: true };
      }

      const { error } = await supabase.from("sections").delete().eq("id", sectionId);
      if (error) return { resultContent: error.message, isError: true };

      return {
        resultContent: `Removed the ${section.type} section.`,
        isError: false,
        diffEntry: { action: "remove_section", sectionId, before: { type: section.type, content: section.content }, after: null },
      };
    }

    case "reorder_sections": {
      const orderedIds = Array.isArray(input.ordered_section_ids) ? input.ordered_section_ids.map(String) : [];

      const { data: existing } = await supabase.from("sections").select("id, position").eq("site_id", ctx.siteId);
      const existingIds = new Set((existing ?? []).map((s) => s.id));

      if (orderedIds.length !== existingIds.size || orderedIds.some((id) => !existingIds.has(id))) {
        return {
          resultContent: "ordered_section_ids must list every section of this site exactly once.",
          isError: true,
        };
      }

      const before = existing;
      await Promise.all(
        orderedIds.map((id, position) => supabase.from("sections").update({ position }).eq("id", id)),
      );

      return {
        resultContent: "Reordered sections.",
        isError: false,
        diffEntry: { action: "reorder_sections", before, after: orderedIds.map((id, position) => ({ id, position })) },
      };
    }

    case "update_theme": {
      const patch = (input.patch ?? {}) as Record<string, unknown>;
      const parsedPatch = themeTokensSchema.partial().safeParse(patch);
      if (!parsedPatch.success) {
        return {
          resultContent: `Invalid theme patch: ${parsedPatch.error.issues.map((i) => i.message).join(", ")}`,
          isError: true,
        };
      }

      const { data: existing } = await supabase.from("site_themes").select("tokens").eq("site_id", ctx.siteId).maybeSingle();
      const before = (existing?.tokens ?? {}) as Record<string, unknown>;
      const after = mergeThemeTokens(before, parsedPatch.data);

      const { error } = await supabase.from("site_themes").update({ tokens: after }).eq("site_id", ctx.siteId);
      if (error) return { resultContent: error.message, isError: true };

      return {
        resultContent: "Updated theme.",
        isError: false,
        diffEntry: { action: "update_theme", before, after },
      };
    }

    case "update_seo": {
      const patch = (input.patch ?? {}) as Record<string, unknown>;

      const { data: existing } = await supabase.from("sites").select("seo").eq("id", ctx.siteId).single();
      const before = (existing?.seo ?? {}) as Record<string, unknown>;
      const after = { ...before, ...patch };

      const { error } = await supabase.from("sites").update({ seo: after }).eq("id", ctx.siteId);
      if (error) return { resultContent: error.message, isError: true };

      return {
        resultContent: "Updated SEO.",
        isError: false,
        diffEntry: { action: "update_seo", before, after },
      };
    }

    case "request_clarification": {
      const question = String(input.question ?? "");
      const options = Array.isArray(input.options) ? input.options.map(String) : undefined;
      return {
        resultContent: "Clarification requested from the user.",
        isError: false,
        clarification: { question, options },
      };
    }

    default:
      return { resultContent: `Unknown tool "${name}".`, isError: true };
  }
}

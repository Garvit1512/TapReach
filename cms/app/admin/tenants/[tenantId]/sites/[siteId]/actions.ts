"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SectionType } from "@/lib/sections/types";
import { themeTokensSchema, mergeThemeTokens } from "@/lib/theme/schema";

type SnapshotSection = {
  type: SectionType;
  position: number;
  content: Record<string, unknown>;
  is_visible: boolean;
};

type Snapshot = {
  sections: SnapshotSection[];
  theme: Record<string, unknown>;
  seo: Record<string, unknown>;
};

function paths(tenantId: string, siteId: string, subdomain?: string | null) {
  return {
    builder: `/admin/tenants/${tenantId}/sites/${siteId}/builder`,
    versions: `/admin/tenants/${tenantId}/sites/${siteId}/versions`,
    preview: `/admin/tenants/${tenantId}/sites/${siteId}/preview`,
    tenant: `/admin/tenants/${tenantId}`,
    public: subdomain ? `/s/${subdomain}` : null,
  };
}

export async function publishSite(siteId: string, tenantId: string) {
  const supabase = await createClient();

  const [{ data: site }, { data: sections }, { data: theme }, { data: userRes }] = await Promise.all([
    supabase.from("sites").select("subdomain, seo").eq("id", siteId).single(),
    supabase
      .from("sections")
      .select("type, position, content, is_visible")
      .eq("site_id", siteId)
      .order("position", { ascending: true }),
    supabase.from("site_themes").select("tokens").eq("site_id", siteId).maybeSingle(),
    supabase.auth.getUser(),
  ]);

  if (!site) throw new Error("Site not found.");

  const snapshot: Snapshot = {
    sections: (sections ?? []) as SnapshotSection[],
    theme: (theme?.tokens ?? {}) as Record<string, unknown>,
    seo: (site.seo ?? {}) as Record<string, unknown>,
  };

  const { data: last } = await supabase
    .from("site_versions")
    .select("version_number")
    .eq("site_id", siteId)
    .order("version_number", { ascending: false })
    .limit(1);

  const versionNumber = (last?.[0]?.version_number ?? 0) + 1;

  const { data: version, error: versionError } = await supabase
    .from("site_versions")
    .insert({
      site_id: siteId,
      version_number: versionNumber,
      snapshot,
      published_by: userRes.user?.id ?? null,
    })
    .select("id")
    .single();

  if (versionError) throw new Error(versionError.message);

  const { error: siteError } = await supabase
    .from("sites")
    .update({ published_snapshot: snapshot, published_version_id: version.id, status: "live" })
    .eq("id", siteId);

  if (siteError) throw new Error(siteError.message);

  const p = paths(tenantId, siteId, site.subdomain);
  revalidatePath(p.builder);
  revalidatePath(p.versions);
  revalidatePath(p.tenant);
  if (p.public) revalidatePath(p.public);
}

export async function unpublishSite(siteId: string, tenantId: string) {
  const supabase = await createClient();
  const { data: site, error } = await supabase
    .from("sites")
    .update({ status: "draft" })
    .eq("id", siteId)
    .select("subdomain")
    .single();

  if (error) throw new Error(error.message);

  const p = paths(tenantId, siteId, site?.subdomain);
  revalidatePath(p.builder);
  revalidatePath(p.tenant);
  if (p.public) revalidatePath(p.public);
}

export async function restoreVersion(versionId: string, siteId: string, tenantId: string) {
  const supabase = await createClient();

  const { data: version, error: versionError } = await supabase
    .from("site_versions")
    .select("snapshot")
    .eq("id", versionId)
    .eq("site_id", siteId)
    .single();

  if (versionError || !version) throw new Error(versionError?.message ?? "Version not found.");

  const snapshot = version.snapshot as Snapshot;

  const { error: deleteError } = await supabase.from("sections").delete().eq("site_id", siteId);
  if (deleteError) throw new Error(deleteError.message);

  if (snapshot.sections.length > 0) {
    const { error: insertError } = await supabase.from("sections").insert(
      snapshot.sections.map((s) => ({
        site_id: siteId,
        type: s.type,
        position: s.position,
        content: s.content,
        is_visible: s.is_visible,
      })),
    );
    if (insertError) throw new Error(insertError.message);
  }

  const { error: themeError } = await supabase
    .from("site_themes")
    .update({ tokens: snapshot.theme })
    .eq("site_id", siteId);
  if (themeError) throw new Error(themeError.message);

  const p = paths(tenantId, siteId, null);
  revalidatePath(p.builder);
  revalidatePath(p.preview);
  revalidatePath(p.versions);
}

export async function updateTheme(siteId: string, patch: Record<string, unknown>, revalidatePathTarget: string) {
  const supabase = await createClient();

  const { data: existing, error: readError } = await supabase
    .from("site_themes")
    .select("tokens")
    .eq("site_id", siteId)
    .maybeSingle();
  if (readError) throw new Error(readError.message);

  const tokens = mergeThemeTokens((existing?.tokens ?? {}) as Record<string, unknown>, patch);
  const { error } = await supabase.from("site_themes").update({ tokens }).eq("site_id", siteId);
  if (error) throw new Error(error.message);

  revalidatePath(revalidatePathTarget);
}

export async function setThemeTokens(siteId: string, tokens: Record<string, unknown>, revalidatePathTarget: string) {
  const parsed = themeTokensSchema.safeParse(tokens);
  if (!parsed.success) throw new Error(parsed.error.issues.map((i) => i.message).join(", "));

  const supabase = await createClient();
  const { error } = await supabase.from("site_themes").update({ tokens: parsed.data }).eq("site_id", siteId);
  if (error) throw new Error(error.message);

  revalidatePath(revalidatePathTarget);
}

export async function updateSeo(siteId: string, patch: Record<string, unknown>, revalidatePathTarget: string) {
  const supabase = await createClient();

  const { data: existing, error: readError } = await supabase.from("sites").select("seo").eq("id", siteId).single();
  if (readError) throw new Error(readError.message);

  const seo = { ...((existing?.seo ?? {}) as Record<string, unknown>), ...patch };
  const { error } = await supabase.from("sites").update({ seo }).eq("id", siteId);
  if (error) throw new Error(error.message);

  revalidatePath(revalidatePathTarget);
}

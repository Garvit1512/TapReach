import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SitePage } from "@/lib/sections/SitePage";
import type { Section } from "@/lib/sections/types";

export default async function PreviewPage(
  props: PageProps<"/admin/tenants/[tenantId]/sites/[siteId]/preview">,
) {
  const { tenantId, siteId } = await props.params;
  const supabase = await createClient();

  const { data: site } = await supabase.from("sites").select("id, name, status").eq("id", siteId).maybeSingle();

  if (!site) {
    notFound();
  }

  const [{ data: sections }, { data: theme }] = await Promise.all([
    supabase
      .from("sections")
      .select("*")
      .eq("site_id", siteId)
      .eq("is_visible", true)
      .order("position", { ascending: true }),
    supabase.from("site_themes").select("tokens").eq("site_id", siteId).maybeSingle(),
  ]);

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-6 py-3 backdrop-blur">
        <Link
          href={`/admin/tenants/${tenantId}/sites/${siteId}/builder`}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to builder
        </Link>
        <span className="text-sm text-muted-foreground">
          Previewing draft content for <span className="font-medium text-foreground">{site.name}</span> — this is
          what visitors will see once the site is live.
        </span>
      </div>
      <SitePage
        sections={(sections ?? []) as Section[]}
        theme={(theme?.tokens ?? {}) as Record<string, unknown>}
        siteId={siteId}
      />
    </div>
  );
}

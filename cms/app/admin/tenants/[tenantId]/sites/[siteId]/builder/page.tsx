import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AddSectionMenu } from "./add-section-menu";
import { SectionItem } from "./section-item";
import { PublishToggle } from "../publish-toggle";
import type { Section } from "@/lib/sections/types";
import { ExternalLink } from "lucide-react";

export default async function BuilderPage(
  props: PageProps<"/admin/tenants/[tenantId]/sites/[siteId]/builder">,
) {
  const { tenantId, siteId } = await props.params;
  const supabase = await createClient();

  const { data: site } = await supabase.from("sites").select("*").eq("id", siteId).maybeSingle();

  if (!site) {
    notFound();
  }

  const { data: sections } = await supabase
    .from("sections")
    .select("*")
    .eq("site_id", siteId)
    .order("position", { ascending: true });

  const revalidatePathTarget = `/admin/tenants/${tenantId}/sites/${siteId}/builder`;
  const publicPath = `/s/${site.subdomain}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href={`/admin/tenants/${tenantId}`} className="text-sm text-muted-foreground hover:underline">
            ← Back to tenant
          </Link>
          <h1 className="text-xl font-semibold">{site.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/tenants/${tenantId}/sites/${siteId}/preview`}
            className="text-sm text-muted-foreground hover:underline"
          >
            Full preview
          </Link>
          {site.status === "live" && (
            <a
              href={publicPath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:underline"
            >
              View live site <ExternalLink className="size-3.5" />
            </a>
          )}
          <PublishToggle siteId={siteId} tenantId={tenantId} status={site.status} />
          <AddSectionMenu siteId={siteId} tenantId={tenantId} publicPath={publicPath} />
        </div>
      </div>

      <div className="space-y-4">
        {(sections ?? []).map((section) => (
          <SectionItem
            key={section.id}
            section={section as Section}
            siteId={siteId}
            revalidatePathTarget={revalidatePathTarget}
            publicPath={publicPath}
          />
        ))}
        {(sections ?? []).length === 0 && (
          <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No sections yet — add one to start building this site.
          </p>
        )}
      </div>
    </div>
  );
}

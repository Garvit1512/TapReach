import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SitePage } from "@/lib/sections/SitePage";
import type { Section } from "@/lib/sections/types";

type Snapshot = {
  sections: Omit<Section, "id" | "site_id" | "tenant_id">[];
  theme: Record<string, unknown>;
  seo: { title?: string; description?: string };
};

async function getSite(subdomain: string) {
  const supabase = await createClient();
  const { data: site } = await supabase
    .from("sites")
    .select("id, name, published_snapshot")
    .eq("subdomain", subdomain)
    .maybeSingle();

  return site;
}

export async function generateMetadata(
  props: PageProps<"/s/[subdomain]">,
): Promise<Metadata> {
  const { subdomain } = await props.params;
  const site = await getSite(subdomain);

  if (!site || !site.published_snapshot) return {};

  const snapshot = site.published_snapshot as Snapshot;

  return {
    title: snapshot.seo?.title || site.name,
    description: snapshot.seo?.description || undefined,
  };
}

export default async function PublicSitePage(props: PageProps<"/s/[subdomain]">) {
  const { subdomain } = await props.params;
  const site = await getSite(subdomain);

  if (!site || !site.published_snapshot) {
    notFound();
  }

  const snapshot = site.published_snapshot as Snapshot;
  const sections: Section[] = snapshot.sections.map((s, i) => ({
    ...s,
    id: `published-${i}`,
    site_id: site.id,
    tenant_id: "",
  }));

  return <SitePage sections={sections} theme={snapshot.theme} siteId={site.id} />;
}

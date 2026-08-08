import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SitePage } from "@/lib/sections/SitePage";
import type { Section } from "@/lib/sections/types";

async function getSite(subdomain: string) {
  const supabase = await createClient();
  const { data: site } = await supabase
    .from("sites")
    .select("id, name, seo")
    .eq("subdomain", subdomain)
    .maybeSingle();

  return site;
}

export async function generateMetadata(
  props: PageProps<"/s/[subdomain]">,
): Promise<Metadata> {
  const { subdomain } = await props.params;
  const site = await getSite(subdomain);

  if (!site) return {};

  const seo = (site.seo ?? {}) as { title?: string; description?: string };

  return {
    title: seo.title || site.name,
    description: seo.description || undefined,
  };
}

export default async function PublicSitePage(props: PageProps<"/s/[subdomain]">) {
  const { subdomain } = await props.params;
  const site = await getSite(subdomain);

  if (!site) {
    notFound();
  }

  const supabase = await createClient();
  const { data: sections } = await supabase
    .from("sections")
    .select("*")
    .eq("site_id", site.id)
    .order("position", { ascending: true });

  return <SitePage sections={(sections ?? []) as Section[]} />;
}

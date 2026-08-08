import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MediaGrid } from "./media-grid";
import type { MediaAsset } from "@/lib/media/types";

export default async function MediaLibraryPage(props: PageProps<"/admin/tenants/[tenantId]/media">) {
  const { tenantId } = await props.params;
  const supabase = await createClient();

  const { data: tenant } = await supabase.from("tenants").select("id, name").eq("id", tenantId).maybeSingle();

  if (!tenant) {
    notFound();
  }

  const { data: assets } = await supabase
    .from("media_assets")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/admin/tenants/${tenantId}`} className="text-sm text-muted-foreground hover:underline">
          ← Back to tenant
        </Link>
        <h1 className="text-xl font-semibold">Media library — {tenant.name}</h1>
      </div>
      <MediaGrid tenantId={tenantId} initialAssets={(assets ?? []) as MediaAsset[]} />
    </div>
  );
}

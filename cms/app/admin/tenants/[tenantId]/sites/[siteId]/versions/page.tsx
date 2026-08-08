import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RestoreButton } from "./restore-button";

export default async function VersionsPage(
  props: PageProps<"/admin/tenants/[tenantId]/sites/[siteId]/versions">,
) {
  const { tenantId, siteId } = await props.params;
  const supabase = await createClient();

  const { data: site } = await supabase
    .from("sites")
    .select("id, name, published_version_id")
    .eq("id", siteId)
    .maybeSingle();

  if (!site) {
    notFound();
  }

  const { data: versions } = await supabase
    .from("site_versions")
    .select("id, version_number, published_at, published_by, profiles(full_name)")
    .eq("site_id", siteId)
    .order("version_number", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/admin/tenants/${tenantId}/sites/${siteId}/builder`}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to builder
        </Link>
        <h1 className="text-xl font-semibold">Version history — {site.name}</h1>
        <p className="text-sm text-muted-foreground">
          Every version was a real Publish. Restoring loads a version&apos;s content into the draft — you still
          need to Publish again to make it live.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Version</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>By</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {(versions ?? []).map((v) => (
            <TableRow key={v.id}>
              <TableCell className="font-medium">
                v{v.version_number}
                {v.id === site.published_version_id && (
                  <Badge className="ml-2" variant="default">
                    Live
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(v.published_at).toLocaleString()}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {(v.profiles as unknown as { full_name: string | null } | null)?.full_name ?? "—"}
              </TableCell>
              <TableCell>
                <RestoreButton
                  versionId={v.id}
                  siteId={siteId}
                  tenantId={tenantId}
                  versionNumber={v.version_number}
                />
              </TableCell>
            </TableRow>
          ))}
          {(versions ?? []).length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No versions published yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

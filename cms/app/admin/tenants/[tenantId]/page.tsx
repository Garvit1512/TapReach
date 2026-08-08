import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { NewSiteForm } from "./new-site-form";

export default async function TenantDetailPage(props: PageProps<"/admin/tenants/[tenantId]">) {
  const { tenantId } = await props.params;
  const supabase = await createClient();
  const user = await getCurrentUser();

  const { data: tenant } = await supabase.from("tenants").select("*").eq("id", tenantId).maybeSingle();

  if (!tenant) {
    notFound();
  }

  const { data: sites } = await supabase
    .from("sites")
    .select("id, name, status, subdomain, created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  const canCreate = user?.staffRole === "super_admin" || user?.staffRole === "developer";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">{tenant.name}</h1>
          <p className="text-sm capitalize text-muted-foreground">
            {tenant.vertical} · care plan: {tenant.care_plan_status}
          </p>
        </div>
        <Link href={`/admin/tenants/${tenantId}/media`} className="text-sm text-muted-foreground hover:underline">
          Media library
        </Link>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Sites</h2>
        {canCreate && <NewSiteForm tenantId={tenantId} />}
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(sites ?? []).map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/tenants/${tenantId}/sites/${s.id}/builder`} className="hover:underline">
                    {s.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={s.status === "live" ? "default" : "secondary"}>{s.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(s.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {(sites ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No sites yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

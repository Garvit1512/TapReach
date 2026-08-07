import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { NewTenantForm } from "./new-tenant-form";

export default async function TenantsPage() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  const { data: tenants, error } = await supabase
    .from("tenants")
    .select("id, name, vertical, care_plan_status, created_at")
    .order("created_at", { ascending: false });

  const canCreate = user?.staffRole === "super_admin" || user?.staffRole === "developer";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Tenants</h1>
        <p className="text-sm text-muted-foreground">
          Scoped to what your role can see — {tenants?.length ?? 0} visible.
        </p>
      </div>

      {canCreate && <NewTenantForm />}

      {error && <p className="text-sm text-destructive">{error.message}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Vertical</TableHead>
            <TableHead>Care plan</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(tenants ?? []).map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.name}</TableCell>
              <TableCell className="capitalize">{t.vertical}</TableCell>
              <TableCell>
                <Badge variant={t.care_plan_status === "active" ? "default" : "secondary"}>
                  {t.care_plan_status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(t.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
          {(tenants ?? []).length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No tenants visible to your role yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

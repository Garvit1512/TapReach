import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AssignRoleForm } from "./assign-role-form";

export default async function UsersPage() {
  const user = await getCurrentUser();
  if (user?.staffRole !== "super_admin") {
    redirect("/admin");
  }

  const supabase = await createClient();
  const { data: staff } = await supabase
    .from("staff_members")
    .select("user_id, role, created_at, profiles(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Team & Roles</h1>
        <p className="text-sm text-muted-foreground">
          Assign staff roles. New team members must sign up (or be invited via Supabase Auth)
          before you can assign them a role here.
        </p>
      </div>

      <AssignRoleForm />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(staff ?? []).map((s) => (
            <TableRow key={s.user_id}>
              <TableCell>{(s.profiles as unknown as { full_name: string | null } | null)?.full_name ?? "—"}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{s.user_id}</TableCell>
              <TableCell className="capitalize">{s.role.replace("_", " ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

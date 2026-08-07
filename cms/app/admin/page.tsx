import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { count: tenantCount } = await supabase
    .from("tenants")
    .select("id", { count: "exact", head: true });

  if (!user?.staffRole) {
    return (
      <div className="max-w-lg">
        <h1 className="text-xl font-semibold">No dashboard access yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account isn&apos;t assigned a staff role yet. If you&apos;re a client, your site
          dashboard is coming in a later phase of this build.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Welcome, {user.fullName || user.email}</h1>
        <p className="text-sm text-muted-foreground">
          Signed in as <span className="font-medium">{user.staffRole.replace("_", " ")}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tenants you can see</CardDescription>
            <CardTitle className="text-3xl">{tenantCount ?? 0}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Row count is already scoped by RLS for your role — this number should differ across
            roles.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

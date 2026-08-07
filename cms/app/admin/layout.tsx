import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const STAFF_NAV = [
  { href: "/admin", label: "Dashboard", roles: ["super_admin", "developer", "sales", "support"] },
  { href: "/admin/tenants", label: "Tenants", roles: ["super_admin", "developer", "sales", "support"] },
  { href: "/admin/users", label: "Team & Roles", roles: ["super_admin"] },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const nav = user.staffRole
    ? STAFF_NAV.filter((item) => item.roles.includes(user.staffRole!))
    : [];

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r bg-muted/20 p-4">
        <div className="mb-6 px-2 text-lg font-semibold">TapReach CMS</div>
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Separator className="my-4" />
        <div className="px-2 text-xs text-muted-foreground">
          {user.fullName || user.email}
          {user.staffRole && <div className="mt-0.5 uppercase tracking-wide">{user.staffRole.replace("_", " ")}</div>}
        </div>
        <form action={signOut} className="mt-2">
          <Button type="submit" variant="ghost" size="sm" className="w-full justify-start">
            Sign out
          </Button>
        </form>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

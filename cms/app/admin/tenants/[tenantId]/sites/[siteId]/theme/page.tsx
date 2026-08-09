import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { themeTokensSchema, defaultThemeTokens } from "@/lib/theme/schema";
import { ThemePanel } from "./theme-panel";

export default async function ThemePage(
  props: PageProps<"/admin/tenants/[tenantId]/sites/[siteId]/theme">,
) {
  const { tenantId, siteId } = await props.params;
  const supabase = await createClient();

  const [{ data: site }, { data: theme }] = await Promise.all([
    supabase.from("sites").select("id, name").eq("id", siteId).maybeSingle(),
    supabase.from("site_themes").select("tokens").eq("site_id", siteId).maybeSingle(),
  ]);

  if (!site) {
    notFound();
  }

  const parsedTokens = themeTokensSchema.safeParse(theme?.tokens ?? {});
  const tokens = parsedTokens.success ? parsedTokens.data : defaultThemeTokens;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/admin/tenants/${tenantId}/sites/${siteId}/builder`}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to builder
        </Link>
        <h1 className="text-xl font-semibold">{site.name} — Theme</h1>
        <p className="text-sm text-muted-foreground">
          Changes apply to draft and preview immediately. They only reach the live site the next time you Publish.
        </p>
      </div>

      <ThemePanel siteId={siteId} tenantId={tenantId} tokens={tokens} />
    </div>
  );
}

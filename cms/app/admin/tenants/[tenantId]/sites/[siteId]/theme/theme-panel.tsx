"use client";

import { setThemeTokens } from "../actions";
import { ThemeEditorForm } from "@/lib/theme/EditorForm";
import type { ThemeTokens } from "@/lib/theme/schema";

export function ThemePanel({
  siteId,
  tenantId,
  tokens,
}: {
  siteId: string;
  tenantId: string;
  tokens: ThemeTokens;
}) {
  const revalidatePathTarget = `/admin/tenants/${tenantId}/sites/${siteId}/theme`;

  const handleSave = async (next: ThemeTokens) => {
    await setThemeTokens(siteId, next, revalidatePathTarget);
  };

  return <ThemeEditorForm tokens={tokens} onSave={handleSave} />;
}

"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { restoreVersion } from "../actions";
import { Button } from "@/components/ui/button";

export function RestoreButton({
  versionId,
  siteId,
  tenantId,
  versionNumber,
}: {
  versionId: string;
  siteId: string;
  tenantId: string;
  versionNumber: number;
}) {
  const [pending, startTransition] = useTransition();

  const handleRestore = () => {
    if (
      !confirm(
        `Restore version ${versionNumber} into the draft? This replaces all current draft content — it won't affect the live site until you Publish again.`,
      )
    )
      return;

    startTransition(async () => {
      try {
        await restoreVersion(versionId, siteId, tenantId);
        toast.success(`Version ${versionNumber} restored to draft`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to restore version");
      }
    });
  };

  return (
    <Button variant="outline" size="sm" disabled={pending} onClick={handleRestore}>
      Restore to draft
    </Button>
  );
}

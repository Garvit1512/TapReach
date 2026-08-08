"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { publishSite, unpublishSite } from "./actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PublishControls({
  siteId,
  tenantId,
  status,
  hasPublishedSnapshot,
}: {
  siteId: string;
  tenantId: string;
  status: "draft" | "live" | "suspended";
  hasPublishedSnapshot: boolean;
}) {
  const [pending, startTransition] = useTransition();

  const handlePublish = () => {
    startTransition(async () => {
      try {
        await publishSite(siteId, tenantId);
        toast.success("Published");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to publish");
      }
    });
  };

  const handleUnpublish = () => {
    startTransition(async () => {
      try {
        await unpublishSite(siteId, tenantId);
        toast.success("Site taken offline");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to take offline");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={status === "live" ? "default" : "secondary"}>{status}</Badge>
      {status === "live" && (
        <Button variant="outline" size="sm" disabled={pending} onClick={handleUnpublish}>
          Take offline
        </Button>
      )}
      <Button size="sm" disabled={pending} onClick={handlePublish}>
        {hasPublishedSnapshot ? "Republish" : "Publish"}
      </Button>
    </div>
  );
}

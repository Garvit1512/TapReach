"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { setSiteStatus } from "./actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PublishToggle({
  siteId,
  tenantId,
  status,
}: {
  siteId: string;
  tenantId: string;
  status: "draft" | "live" | "suspended";
}) {
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    const next = status === "live" ? "draft" : "live";
    startTransition(async () => {
      try {
        await setSiteStatus(siteId, tenantId, next);
        toast.success(next === "live" ? "Site is now live" : "Site taken offline");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update status");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={status === "live" ? "default" : "secondary"}>{status}</Badge>
      <Button variant="outline" size="sm" disabled={pending} onClick={toggle}>
        {status === "live" ? "Take offline" : "Go live"}
      </Button>
    </div>
  );
}

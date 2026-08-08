"use client";

import { useActionState } from "react";
import { createSite } from "./sites/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NewSiteForm({ tenantId }: { tenantId: string }) {
  const [state, formAction, pending] = useActionState<{ error: string | null }, FormData>(createSite, {
    error: null,
  });

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 rounded-lg border p-4">
      <input type="hidden" name="tenant_id" value={tenantId} />
      <div className="space-y-1.5">
        <Label htmlFor="site-name">Site name</Label>
        <Input id="site-name" name="name" placeholder="Main website" required className="w-56" />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create site"}
      </Button>
      {state.error && <p className="w-full text-sm text-destructive">{state.error}</p>}
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { createTenant } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const VERTICALS = ["gym", "salon", "cafe", "clinic", "hotel", "restaurant", "retail", "other"];

export function NewTenantForm() {
  const [state, formAction, pending] = useActionState(createTenant, { error: null });

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 rounded-lg border p-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Business name</Label>
        <Input id="name" name="name" placeholder="Iron Works Fitness" required className="w-56" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact_email">Contact email</Label>
        <Input id="contact_email" name="contact_email" type="email" className="w-56" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="vertical">Vertical</Label>
        <Select name="vertical" defaultValue="other">
          <SelectTrigger className="w-40" id="vertical">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VERTICALS.map((v) => (
              <SelectItem key={v} value={v}>
                {v[0].toUpperCase() + v.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Adding..." : "Add tenant"}
      </Button>
      {state.error && <p className="w-full text-sm text-destructive">{state.error}</p>}
    </form>
  );
}

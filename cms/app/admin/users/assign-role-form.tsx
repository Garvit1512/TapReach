"use client";

import { useActionState } from "react";
import { setStaffRole } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ROLES = ["super_admin", "developer", "sales", "support"];

export function AssignRoleForm() {
  const [state, formAction, pending] = useActionState(setStaffRole, { error: null });

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 rounded-lg border p-4">
      <div className="space-y-1.5">
        <Label htmlFor="user_id">User ID (from Supabase Auth)</Label>
        <Input id="user_id" name="user_id" placeholder="uuid" required className="w-72" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="role">Role</Label>
        <Select name="role" defaultValue="support">
          <SelectTrigger className="w-44" id="role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {r.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Assign role"}
      </Button>
      {state.error && <p className="w-full text-sm text-destructive">{state.error}</p>}
    </form>
  );
}

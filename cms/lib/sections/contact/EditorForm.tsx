"use client";

import type { ContactContent } from "./schema";
import { useEditorSave } from "../shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function ContactEditorForm({
  content,
  onSave,
}: {
  content: ContactContent;
  onSave: (content: ContactContent) => Promise<void>;
}) {
  const { draft, setDraft, saving, save } = useEditorSave(content, onSave);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Heading</Label>
        <Input value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Phone</Label>
          <Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Address</Label>
        <Textarea rows={2} value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={draft.formEnabled} onCheckedChange={(formEnabled) => setDraft({ ...draft, formEnabled })} />
        <Label className="text-sm font-normal">Show contact form</Label>
      </div>
      <Button onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

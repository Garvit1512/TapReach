"use client";

import type { ServicesContent } from "./schema";
import { useEditorSave, ArrayField } from "../shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ServicesEditorForm({
  content,
  onSave,
}: {
  content: ServicesContent;
  onSave: (content: ServicesContent) => Promise<void>;
}) {
  const { draft, setDraft, saving, save } = useEditorSave(content, onSave);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Heading</Label>
        <Input value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} />
      </div>
      <ArrayField
        label="Services"
        items={draft.items}
        onChange={(items) => setDraft({ ...draft, items })}
        newItem={() => ({ title: "New service", description: "" })}
        renderItem={(item, _i, update) => (
          <>
            <Input value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="Title" />
            <Input
              value={item.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder="Description"
            />
          </>
        )}
      />
      <Button onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

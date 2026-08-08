"use client";

import type { GalleryContent } from "./schema";
import { useEditorSave, ArrayField } from "../shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GalleryEditorForm({
  content,
  onSave,
}: {
  content: GalleryContent;
  onSave: (content: GalleryContent) => Promise<void>;
}) {
  const { draft, setDraft, saving, save } = useEditorSave(content, onSave);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Heading</Label>
        <Input value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} />
      </div>
      <ArrayField
        label="Images"
        items={draft.images}
        onChange={(images) => setDraft({ ...draft, images })}
        newItem={() => ({ url: "", alt: "" })}
        renderItem={(item, _i, update) => (
          <>
            <Input value={item.url} onChange={(e) => update({ url: e.target.value })} placeholder="Image URL" />
            <Input value={item.alt} onChange={(e) => update({ alt: e.target.value })} placeholder="Alt text" />
          </>
        )}
      />
      <Button onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

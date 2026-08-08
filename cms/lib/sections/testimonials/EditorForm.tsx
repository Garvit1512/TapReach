"use client";

import type { TestimonialsContent } from "./schema";
import { useEditorSave, ArrayField } from "../shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaPicker } from "@/lib/media/MediaPicker";

export function TestimonialsEditorForm({
  content,
  onSave,
}: {
  content: TestimonialsContent;
  onSave: (content: TestimonialsContent) => Promise<void>;
}) {
  const { draft, setDraft, saving, save } = useEditorSave(content, onSave);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Heading</Label>
        <Input value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} />
      </div>
      <ArrayField
        label="Testimonials"
        items={draft.items}
        onChange={(items) => setDraft({ ...draft, items })}
        newItem={() => ({ quote: "", name: "", business: "", rating: 5, avatarUrl: "" })}
        renderItem={(item, _i, update) => (
          <>
            <Textarea rows={2} value={item.quote} onChange={(e) => update({ quote: e.target.value })} placeholder="Quote" />
            <div className="grid grid-cols-2 gap-2">
              <Input value={item.name} onChange={(e) => update({ name: e.target.value })} placeholder="Name" />
              <Input value={item.business} onChange={(e) => update({ business: e.target.value })} placeholder="Business" />
            </div>
            <MediaPicker value={item.avatarUrl} onChange={(avatarUrl) => update({ avatarUrl })} />
          </>
        )}
      />
      <Button onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

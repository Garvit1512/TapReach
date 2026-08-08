"use client";

import type { FaqContent } from "./schema";
import { useEditorSave, ArrayField } from "../shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function FaqEditorForm({
  content,
  onSave,
}: {
  content: FaqContent;
  onSave: (content: FaqContent) => Promise<void>;
}) {
  const { draft, setDraft, saving, save } = useEditorSave(content, onSave);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Heading</Label>
        <Input value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} />
      </div>
      <ArrayField
        label="Questions"
        items={draft.items}
        onChange={(items) => setDraft({ ...draft, items })}
        newItem={() => ({ question: "", answer: "" })}
        renderItem={(item, _i, update) => (
          <>
            <Input value={item.question} onChange={(e) => update({ question: e.target.value })} placeholder="Question" />
            <Textarea rows={2} value={item.answer} onChange={(e) => update({ answer: e.target.value })} placeholder="Answer" />
          </>
        )}
      />
      <Button onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

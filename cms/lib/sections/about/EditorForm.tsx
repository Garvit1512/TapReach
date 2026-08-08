"use client";

import type { AboutContent } from "./schema";
import { useEditorSave } from "../shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaPicker } from "@/lib/media/MediaPicker";

export function AboutEditorForm({
  content,
  onSave,
}: {
  content: AboutContent;
  onSave: (content: AboutContent) => Promise<void>;
}) {
  const { draft, setDraft, saving, save } = useEditorSave(content, onSave);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Heading</Label>
        <Input value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>Body</Label>
        <Textarea rows={4} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>Image</Label>
        <MediaPicker value={draft.imageUrl} onChange={(imageUrl) => setDraft({ ...draft, imageUrl })} />
      </div>
      <Button onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

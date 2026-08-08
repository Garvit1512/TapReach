"use client";

import type { HeroContent } from "./schema";
import { useEditorSave } from "../shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaPicker } from "@/lib/media/MediaPicker";

export function HeroEditorForm({
  content,
  onSave,
}: {
  content: HeroContent;
  onSave: (content: HeroContent) => Promise<void>;
}) {
  const { draft, setDraft, saving, save } = useEditorSave(content, onSave);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Heading</Label>
        <Input value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>Subheading</Label>
        <Textarea
          rows={2}
          value={draft.subheading}
          onChange={(e) => setDraft({ ...draft, subheading: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Button text</Label>
          <Input value={draft.ctaText} onChange={(e) => setDraft({ ...draft, ctaText: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Button link</Label>
          <Input value={draft.ctaLink} onChange={(e) => setDraft({ ...draft, ctaLink: e.target.value })} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Background image</Label>
        <MediaPicker
          value={draft.backgroundImageUrl}
          onChange={(backgroundImageUrl) => setDraft({ ...draft, backgroundImageUrl })}
        />
      </div>
      <Button onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

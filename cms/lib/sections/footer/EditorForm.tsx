"use client";

import type { FooterContent } from "./schema";
import { useEditorSave, ArrayField } from "../shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FooterEditorForm({
  content,
  onSave,
}: {
  content: FooterContent;
  onSave: (content: FooterContent) => Promise<void>;
}) {
  const { draft, setDraft, saving, save } = useEditorSave(content, onSave);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Footer text</Label>
        <Input value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} />
      </div>
      <ArrayField
        label="Links"
        items={draft.links}
        onChange={(links) => setDraft({ ...draft, links })}
        newItem={() => ({ label: "", url: "" })}
        renderItem={(item, _i, update) => (
          <>
            <Input value={item.label} onChange={(e) => update({ label: e.target.value })} placeholder="Label" />
            <Input value={item.url} onChange={(e) => update({ url: e.target.value })} placeholder="URL" />
          </>
        )}
      />
      <ArrayField
        label="Social links"
        items={draft.socialLinks}
        onChange={(socialLinks) => setDraft({ ...draft, socialLinks })}
        newItem={() => ({ label: "", url: "" })}
        renderItem={(item, _i, update) => (
          <>
            <Input value={item.label} onChange={(e) => update({ label: e.target.value })} placeholder="Platform (e.g. Instagram)" />
            <Input value={item.url} onChange={(e) => update({ url: e.target.value })} placeholder="URL" />
          </>
        )}
      />
      <Button onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

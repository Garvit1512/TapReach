"use client";

import type { PricingContent } from "./schema";
import { useEditorSave, ArrayField } from "../shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function PricingEditorForm({
  content,
  onSave,
}: {
  content: PricingContent;
  onSave: (content: PricingContent) => Promise<void>;
}) {
  const { draft, setDraft, saving, save } = useEditorSave(content, onSave);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Heading</Label>
        <Input value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} />
      </div>
      <ArrayField
        label="Tiers"
        items={draft.tiers}
        onChange={(tiers) => setDraft({ ...draft, tiers })}
        newItem={() => ({ name: "New tier", price: "", period: "one-time", features: [], featured: false, ctaText: "Get started" })}
        renderItem={(tier, _i, update) => (
          <>
            <Input value={tier.name} onChange={(e) => update({ name: e.target.value })} placeholder="Tier name" />
            <div className="grid grid-cols-2 gap-2">
              <Input value={tier.price} onChange={(e) => update({ price: e.target.value })} placeholder="Price (e.g. Rs. 1,000)" />
              <Input value={tier.period} onChange={(e) => update({ period: e.target.value })} placeholder="Period (e.g. one-time)" />
            </div>
            <Textarea
              rows={3}
              value={tier.features.join("\n")}
              onChange={(e) => update({ features: e.target.value.split("\n").filter(Boolean) })}
              placeholder="One feature per line"
            />
            <Input value={tier.ctaText} onChange={(e) => update({ ctaText: e.target.value })} placeholder="Button text" />
            <div className="flex items-center gap-2">
              <Switch checked={tier.featured} onCheckedChange={(featured) => update({ featured })} />
              <Label className="text-sm font-normal">Featured / highlighted</Label>
            </div>
          </>
        )}
      />
      <Button onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

"use client";

import { useEditorSave } from "@/lib/sections/shared";
import type { ThemeTokens } from "./schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RADIUS_OPTIONS = [
  { value: "0px", label: "None" },
  { value: "6px", label: "Small" },
  { value: "12px", label: "Medium" },
  { value: "20px", label: "Large" },
  { value: "999px", label: "Pill" },
];

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="size-9 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-1"
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="#111111" />
      </div>
    </div>
  );
}

export function ThemeEditorForm({
  tokens,
  onSave,
}: {
  tokens: ThemeTokens;
  onSave: (tokens: ThemeTokens) => Promise<void>;
}) {
  const { draft, setDraft, saving, save } = useEditorSave(tokens, onSave);

  return (
    <div className="max-w-xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Heading font</Label>
          <Input
            value={draft.fonts.heading}
            onChange={(e) => setDraft({ ...draft, fonts: { ...draft.fonts, heading: e.target.value } })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Body font</Label>
          <Input
            value={draft.fonts.body}
            onChange={(e) => setDraft({ ...draft, fonts: { ...draft.fonts, body: e.target.value } })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ColorField
          label="Primary color"
          value={draft.colors.primary}
          onChange={(v) => setDraft({ ...draft, colors: { ...draft.colors, primary: v } })}
        />
        <ColorField
          label="Accent color"
          value={draft.colors.accent}
          onChange={(v) => setDraft({ ...draft, colors: { ...draft.colors, accent: v } })}
        />
        <ColorField
          label="Background color"
          value={draft.colors.background}
          onChange={(v) => setDraft({ ...draft, colors: { ...draft.colors, background: v } })}
        />
        <ColorField
          label="Text color"
          value={draft.colors.text}
          onChange={(v) => setDraft({ ...draft, colors: { ...draft.colors, text: v } })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Corner radius</Label>
          <Select value={draft.radius} onValueChange={(v) => setDraft({ ...draft, radius: v ?? draft.radius })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RADIUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Button style</Label>
          <Select
            value={draft.buttonStyle}
            onValueChange={(v) => setDraft({ ...draft, buttonStyle: (v as ThemeTokens["buttonStyle"]) ?? draft.buttonStyle })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save theme"}
      </Button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function ArrayField<T>({
  label,
  items,
  onChange,
  newItem,
  renderItem,
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, index: number, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...items, newItem()])}
        >
          <Plus className="size-3.5" /> Add
        </Button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2 rounded-lg border p-3">
            <div className="flex-1 space-y-2">
              {renderItem(item, index, (patch) => {
                const next = [...items];
                next[index] = { ...next[index], ...patch };
                onChange(next);
              })}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">Nothing here yet.</p>
        )}
      </div>
    </div>
  );
}

export function useEditorSave<T>(content: T, onSave: (content: T) => Promise<void>) {
  const [draft, setDraft] = useState<T>(content);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await onSave(draft);
      toast.success("Saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return { draft, setDraft, saving, save };
}

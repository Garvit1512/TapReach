"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { moveSection, removeSection, toggleSectionVisibility, updateSectionContent } from "./actions";
import { SECTION_REGISTRY } from "@/lib/sections/registry";
import type { Section } from "@/lib/sections/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";

export function SectionItem({
  section,
  siteId,
  revalidatePathTarget,
  publicPath,
}: {
  section: Section;
  siteId: string;
  revalidatePathTarget: string;
  publicPath?: string;
}) {
  const [pending, startTransition] = useTransition();
  const definition = SECTION_REGISTRY[section.type];
  const { Renderer, EditorForm } = definition;

  const move = (direction: "up" | "down") => {
    startTransition(async () => {
      await moveSection(section.id, direction, siteId, revalidatePathTarget, publicPath);
    });
  };

  const toggleVisible = (checked: boolean) => {
    startTransition(async () => {
      await toggleSectionVisibility(section.id, checked, revalidatePathTarget, publicPath);
    });
  };

  const handleRemove = () => {
    if (!confirm(`Remove the ${definition.label} section?`)) return;
    startTransition(async () => {
      try {
        await removeSection(section.id, revalidatePathTarget, publicPath);
        toast.success("Section removed");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to remove section");
      }
    });
  };

  const handleSave = async (content: Record<string, unknown>) => {
    await updateSectionContent(section.id, section.type, content, revalidatePathTarget, publicPath);
  };

  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{definition.label}</span>
          {!section.is_visible && <span className="text-xs text-muted-foreground">(hidden)</span>}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" disabled={pending} onClick={() => move("up")}>
            <ChevronUp className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled={pending} onClick={() => move("down")}>
            <ChevronDown className="size-4" />
          </Button>
          <Switch checked={section.is_visible} onCheckedChange={toggleVisible} disabled={pending} />
          <Button
            variant="ghost"
            size="icon"
            disabled={pending}
            className="text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
      <Tabs defaultValue="edit" className="p-4">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="pt-4">
          <EditorForm content={section.content} onSave={handleSave} />
        </TabsContent>
        <TabsContent value="preview" className="pt-4">
          <Renderer content={section.content} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

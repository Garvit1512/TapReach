"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { addSection } from "./actions";
import { SECTION_REGISTRY } from "@/lib/sections/registry";
import { SECTION_TYPES, type SectionType } from "@/lib/sections/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";

export function AddSectionMenu({ siteId, tenantId }: { siteId: string; tenantId: string }) {
  const [pending, startTransition] = useTransition();

  const handleAdd = (type: SectionType) => {
    startTransition(async () => {
      try {
        await addSection(siteId, tenantId, type);
        toast.success(`${SECTION_REGISTRY[type].label} section added`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to add section");
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={pending}
        render={
          <Button>
            <Plus className="size-4" /> Add section
          </Button>
        }
      />
      <DropdownMenuContent>
        {SECTION_TYPES.map((type) => (
          <DropdownMenuItem key={type} onClick={() => handleAdd(type)}>
            {SECTION_REGISTRY[type].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

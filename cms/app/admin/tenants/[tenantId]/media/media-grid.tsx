"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { uploadMedia, deleteMedia } from "./actions";
import { mediaPublicUrl } from "@/lib/media/url";
import type { MediaAsset } from "@/lib/media/types";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";

export function MediaGrid({ tenantId, initialAssets }: { tenantId: string; initialAssets: MediaAsset[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const asset = await uploadMedia(tenantId, formData);
      setAssets((prev) => [asset, ...prev]);
      toast.success("Uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = (asset: MediaAsset) => {
    if (!confirm("Delete this file? Any section still referencing it will show a broken image.")) return;
    startTransition(async () => {
      try {
        await deleteMedia(asset.id, tenantId, asset.storage_path);
        setAssets((prev) => prev.filter((a) => a.id !== asset.id));
        toast.success("Deleted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete");
      }
    });
  };

  return (
    <div className="space-y-4">
      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground hover:border-primary">
        <Upload className="size-4" />
        {uploading ? "Uploading..." : "Upload image or video (max 10MB)"}
        <input
          type="file"
          accept="image/*,video/*"
          className="hidden"
          disabled={uploading}
          onChange={handleUpload}
        />
      </label>

      {assets.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No media uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {assets.map((asset) => (
            <div key={asset.id} className="group relative overflow-hidden rounded-lg border">
              <div className="aspect-square bg-muted">
                {asset.file_type === "video" ? (
                  <video src={mediaPublicUrl(asset.storage_path)} className="h-full w-full object-cover" muted />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaPublicUrl(asset.storage_path)}
                    alt={asset.alt_text}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <Button
                variant="destructive"
                size="icon"
                disabled={pending}
                onClick={() => handleDelete(asset)}
                className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="size-4" />
              </Button>
              <p className="truncate px-2 py-1.5 text-xs text-muted-foreground">
                {(asset.size_bytes / 1024).toFixed(0)} KB
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

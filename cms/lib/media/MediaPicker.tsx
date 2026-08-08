"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { uploadMedia } from "@/app/admin/tenants/[tenantId]/media/actions";
import { mediaPublicUrl } from "./url";
import { useTenantId } from "./TenantContext";
import type { MediaAsset } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, Upload } from "lucide-react";

export function MediaPicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const tenantId = useTenantId();
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, startLoadTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    startLoadTransition(async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      setAssets((data ?? []) as MediaAsset[]);
    });
  }, [open, tenantId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const asset = await uploadMedia(tenantId, formData);
      setAssets((prev) => [asset, ...prev]);
      onChange(mediaPublicUrl(asset.storage_path));
      setOpen(false);
      toast.success("Uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex gap-2">
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://..." className="flex-1" />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button type="button" variant="outline" size="icon" title="Choose image">
              <ImageIcon className="size-4" />
            </Button>
          }
        />
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose media</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="library">
            <TabsList>
              <TabsTrigger value="library">Library</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="library" className="pt-4">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : assets.length === 0 ? (
                <p className="text-sm text-muted-foreground">No media uploaded yet — use the Upload tab.</p>
              ) : (
                <div className="grid max-h-96 grid-cols-4 gap-3 overflow-y-auto">
                  {assets
                    .filter((a) => a.file_type === "image")
                    .map((asset) => (
                      <button
                        key={asset.id}
                        type="button"
                        className="aspect-square overflow-hidden rounded-md border hover:ring-2 hover:ring-primary"
                        onClick={() => {
                          onChange(mediaPublicUrl(asset.storage_path));
                          setOpen(false);
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={mediaPublicUrl(asset.storage_path)}
                          alt={asset.alt_text}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="upload" className="pt-4">
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground hover:border-primary">
                <Upload className="size-6" />
                {uploading ? "Uploading..." : "Click to choose an image or video (max 10MB)"}
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={handleUpload}
                />
              </label>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

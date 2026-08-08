"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { MediaAsset } from "@/lib/media/types";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function uploadMedia(tenantId: string, formData: FormData): Promise<MediaAsset> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file provided.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("File is too large (max 10MB).");
  }
  if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
    throw new Error("Only image and video files are supported.");
  }

  const supabase = await createClient();
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const storagePath = `${tenantId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("media").upload(storagePath, file, {
    contentType: file.type,
  });

  if (uploadError) throw new Error(uploadError.message);

  const { data: userRes } = await supabase.auth.getUser();

  const { data: asset, error: insertError } = await supabase
    .from("media_assets")
    .insert({
      tenant_id: tenantId,
      uploaded_by: userRes.user?.id ?? null,
      storage_path: storagePath,
      file_type: file.type.startsWith("video/") ? "video" : "image",
      mime_type: file.type,
      size_bytes: file.size,
    })
    .select("*")
    .single();

  if (insertError) {
    await supabase.storage.from("media").remove([storagePath]);
    throw new Error(insertError.message);
  }

  revalidatePath(`/admin/tenants/${tenantId}/media`);
  return asset as MediaAsset;
}

export async function deleteMedia(assetId: string, tenantId: string, storagePath: string) {
  const supabase = await createClient();

  const { error: storageError } = await supabase.storage.from("media").remove([storagePath]);
  if (storageError) throw new Error(storageError.message);

  const { error } = await supabase.from("media_assets").delete().eq("id", assetId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/tenants/${tenantId}/media`);
}

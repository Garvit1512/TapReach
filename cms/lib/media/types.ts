export type MediaAsset = {
  id: string;
  tenant_id: string;
  uploaded_by: string | null;
  storage_path: string;
  file_type: "image" | "video" | "logo" | "icon";
  mime_type: string;
  size_bytes: number;
  alt_text: string;
  width: number | null;
  height: number | null;
  folder: string | null;
  created_at: string;
};

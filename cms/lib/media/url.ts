export function mediaPublicUrl(storagePath: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${storagePath}`;
}

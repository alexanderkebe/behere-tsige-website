/** Uploads an image to the public `media` bucket and returns its public URL.
 *  RLS allows only admins to write, so this fails for non-admins. */
export async function uploadImage(supabase, folder, file) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from('media')
    .upload(path, file, { upsert: true, cacheControl: '3600' });
  if (error) throw error;
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
}

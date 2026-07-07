import { createPublicClient } from '../supabase/public';

export async function getMediaLinks() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('media_links')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching media_links:', error);
    return [];
  }
  return data;
}

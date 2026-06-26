import { createClient } from '../supabase/server';

export async function getMediaLinks() {
  const supabase = await createClient();
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

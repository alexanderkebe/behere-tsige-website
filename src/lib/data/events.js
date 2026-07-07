import { createPublicClient } from '../supabase/public';

export async function getEvents() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  return data;
}

import { createClient } from '../supabase/server';

export async function getEvents() {
  const supabase = await createClient();
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

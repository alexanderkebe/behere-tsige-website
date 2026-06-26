// Contact data operations helper
import { createClient } from '../supabase/server';

export async function submitContactMessage(message) {
  // If we ever need to perform server-side validations or send emails, this handles it
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('contact_messages')
    .insert(message);
  
  if (error) {
    throw error;
  }
  return data;
}

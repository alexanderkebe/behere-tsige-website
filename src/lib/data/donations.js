import { createClient } from '../supabase/server';

/**
 * Fetches all donation projects from the database, ordered by creation date.
 */
export async function getDonationProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('donation_projects')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching donation projects:', error);
    return [];
  }
  return data;
}

/**
 * Fetches all bank accounts from the database, ordered by display order.
 */
export async function getBankAccounts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bank_accounts')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching bank accounts:', error);
    return [];
  }
  return data;
}

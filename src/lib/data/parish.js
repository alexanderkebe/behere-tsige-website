import { createPublicClient } from '@/lib/supabase/public';

/** Published fathers/clergy, ordered for display. Safe to call before the
 *  schema exists — returns [] on any error so the page still renders. */
export async function getFathers() {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('fathers')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error('getFathers failed:', e?.message || e);
    return [];
  }
}

/** Published parish office members, ordered for display. */
export async function getMembers() {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error('getMembers failed:', e?.message || e);
    return [];
  }
}

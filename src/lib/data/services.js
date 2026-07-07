import { createClient } from '../supabase/server';

export async function getSiteSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('site_settings').select('*');
  if (error) {
    console.error('Error fetching site_settings:', error);
    return {};
  }
  
  // Convert array of {key, value} to an object
  return data.reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}

export async function getAnnualFeasts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('annual_feasts')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching annual_feasts:', error);
    return [];
  }
  return data;
}

export async function getSundaySchoolData() {
  const supabase = await createClient();
  
  const [teamRes, projectsRes, deptsRes] = await Promise.all([
    supabase.from('ss_team').select('*').order('display_order', { ascending: true }),
    supabase.from('ss_projects').select('*').order('event_date', { ascending: true }),
    supabase.from('ss_departments').select('*').order('display_order', { ascending: true }),
  ]);

  return {
    team: teamRes.data || [],
    projects: projectsRes.data || [],
    departments: deptsRes.data || [],
  };
}

export async function getAbnetData() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('abnet_events').select('*').order('event_date', { ascending: true });
  return { events: data || [] };
}

export async function getEvangelismData() {
  const supabase = await createClient();
  
  const [programsRes, sermonsRes] = await Promise.all([
    supabase.from('gospel_programs').select('*').order('display_order', { ascending: true }),
    supabase.from('sermons').select('*').order('display_order', { ascending: true }).limit(3),
  ]);

  return {
    programs: programsRes.data || [],
    sermons: sermonsRes.data || [],
  };
}

export async function getMemorialServices() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('memorial_services').select('*');
  
  if (error) {
    console.error('Error fetching memorial_services:', error);
    return [];
  }
  return data;
}

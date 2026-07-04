import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import defaultContent from '@/data/defaultContent';

/**
 * Public site content, served from the site_content table (one row per
 * section, edited via /admin → Site Content). Sections missing from the DB
 * fall back to defaultContent so the site never renders empty.
 */

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data, error } = await supabase.from('site_content').select('section, data');
    if (error) throw error;

    const content = { ...defaultContent };
    for (const row of data || []) content[row.section] = row.data;

    return NextResponse.json(content, {
      headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (err) {
    console.error('Content route error:', err);
    return NextResponse.json(defaultContent);
  }
}

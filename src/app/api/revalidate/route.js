import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user profile and verify if they are an admin or super_admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse paths to revalidate from the request body
    const body = await req.json();
    const { paths } = body;
    
    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json({ error: 'Invalid paths parameter' }, { status: 400 });
    }

    for (const p of paths) {
      if (typeof p === 'string' && p.startsWith('/')) {
        revalidatePath(p);
      }
    }

    return NextResponse.json({ revalidated: true, paths });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

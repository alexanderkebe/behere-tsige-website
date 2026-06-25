import { NextResponse } from 'next/server';

// Diagnostic: confirms the Supabase URL + publishable key are configured and
// reachable. Returns no secrets. Safe to keep.
export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { ok: false, reason: 'Supabase env vars missing' },
      { status: 500 }
    );
  }

  try {
    // Auth health endpoint is reachable with just the apikey and doesn't
    // depend on database grants — a clean "is Supabase up" probe.
    const res = await fetch(`${url}/auth/v1/health`, { headers: { apikey: key } });
    const body = await res.text();
    return NextResponse.json({ ok: res.ok, supabaseStatus: res.status, detail: body.slice(0, 200) });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 502 });
  }
}

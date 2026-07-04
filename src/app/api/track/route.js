import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Records visitor interactions (page views, clicks, form submits, chat…)
 * into the interactions table for the admin Analytics dashboard.
 * Accepts a batch: { events: [{ type, page, sessionId, lang, meta }] }.
 * Sent via navigator.sendBeacon, so it must accept text/plain bodies too.
 */

export const dynamic = 'force-dynamic';

const MAX_EVENTS = 25;
const clamp = (v, n) => (typeof v === 'string' ? v.slice(0, n) : null);

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    const events = Array.isArray(body?.events) ? body.events.slice(0, MAX_EVENTS) : [];
    if (events.length === 0) return NextResponse.json({ ok: true });

    const userAgent = clamp(request.headers.get('user-agent') || '', 400);

    const rows = events
      .filter((e) => e && typeof e.type === 'string' && e.type.length > 0)
      .map((e) => {
        let meta = {};
        if (e.meta && typeof e.meta === 'object') {
          meta = JSON.stringify(e.meta).length <= 4000 ? e.meta : { truncated: true };
        }
        return {
          event_type: clamp(e.type, 60),
          page: clamp(e.page, 300),
          session_id: clamp(e.sessionId, 80),
          lang: clamp(e.lang, 10),
          referrer: clamp(e.referrer, 500),
          user_agent: userAgent,
          metadata: meta,
        };
      });

    if (rows.length === 0) return NextResponse.json({ ok: true });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { error } = await supabase.from('interactions').insert(rows);
    if (error) console.error('Track insert error:', error.message);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Track route error:', err);
    return NextResponse.json({ ok: true });
  }
}

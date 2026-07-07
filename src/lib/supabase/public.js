import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Cookie-less Supabase client for PUBLIC data fetched in Server Components.
 * Unlike lib/supabase/server.js it never touches next/headers cookies, so
 * pages that use it can be statically rendered and cached (ISR) instead of
 * being forced dynamic on every request.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client using the server-only service role secret key.
 * This client bypasses Row-Level Security (RLS) policies and should only
 * be used on the server (Route Handlers, Server Actions) for admin-level operations.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY');
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

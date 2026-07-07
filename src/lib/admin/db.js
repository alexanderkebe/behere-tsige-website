/**
 * Admin write helpers that FAIL LOUDLY.
 *
 * Supabase's `update()` / `insert()` return `{ error: null }` even when a
 * write changes ZERO rows — for example when Row-Level Security silently
 * blocks it because the admin's session has expired (the request then goes
 * out unauthenticated). The old admin code treated "no error" as success,
 * closed the form, and reloaded — so an edit could vanish with no warning.
 *
 * These helpers:
 *  - confirm there is a live session before writing (and refresh it),
 *  - add `.select()` so the affected rows come back,
 *  - treat an empty result as an explicit, human-readable error.
 */

// Columns the database manages itself — never send them in a write payload.
const IMMUTABLE_FIELDS = ['id', 'created_at', 'updated_at'];

const SESSION_EXPIRED_MESSAGE =
  'Your admin session has expired, so the change was not saved. Please use "Sign Out", sign back in, and try again.';

const ZERO_ROWS_MESSAGE =
  'The change did not save (the database rejected it). This usually means your admin session expired — sign out, sign back in, and try again.';

function stripImmutable(row) {
  const out = { ...row };
  for (const key of IMMUTABLE_FIELDS) delete out[key];
  return out;
}

async function assertSession(supabase) {
  // getSession() also refreshes an about-to-expire token when possible.
  const { data, error } = await supabase.auth.getSession();
  if (error || !data?.session) throw new Error(SESSION_EXPIRED_MESSAGE);
}

/**
 * Insert (no id) or update (has id) a row and RETURN the saved row.
 * Throws a clear error if the session is gone or if 0 rows were written.
 */
export async function saveRow(supabase, table, row, { idField = 'id' } = {}) {
  await assertSession(supabase);
  const payload = stripImmutable(row);

  const isUpdate = row[idField] !== undefined && row[idField] !== null && row[idField] !== '';
  const query = isUpdate
    ? supabase.from(table).update(payload).eq(idField, row[idField]).select()
    : supabase.from(table).insert(payload).select();

  const { data, error } = await query;
  if (error) throw error;
  if (!data || data.length === 0) throw new Error(ZERO_ROWS_MESSAGE);
  return data[0];
}

/**
 * Update specific fields on one row (e.g. a status change) and verify it
 * actually changed a row.
 */
export async function updateRow(supabase, table, id, patch, { idField = 'id' } = {}) {
  await assertSession(supabase);
  const { data, error } = await supabase
    .from(table)
    .update(stripImmutable(patch))
    .eq(idField, id)
    .select();
  if (error) throw error;
  if (!data || data.length === 0) throw new Error(ZERO_ROWS_MESSAGE);
  return data[0];
}

/**
 * Upsert a site_settings config row (key/value JSON) and verify it saved.
 * Used by the config editors, whose upserts otherwise fail silently.
 */
export async function saveConfig(supabase, key, value) {
  await assertSession(supabase);
  const { data, error } = await supabase
    .from('site_settings')
    .upsert({ key, value }, { onConflict: 'key' })
    .select();
  if (error) throw error;
  if (!data || data.length === 0) throw new Error(ZERO_ROWS_MESSAGE);
  return data[0];
}

/**
 * Delete one row and verify it was actually removed (RLS can silently
 * no-op a delete just like an update).
 */
export async function deleteRow(supabase, table, id, { idField = 'id' } = {}) {
  await assertSession(supabase);
  const { data, error } = await supabase.from(table).delete().eq(idField, id).select();
  if (error) throw error;
  if (!data || data.length === 0) throw new Error(ZERO_ROWS_MESSAGE);
  return data[0];
}

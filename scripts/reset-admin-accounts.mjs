// Run without arguments to review an account-only reset; --apply is explicit.
// Uses a private Supabase server key. Never import this into the website.
import { randomBytes } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());

const PLAN_PATH = 'admin-reset-plan.local';
const CREDENTIAL_PATH = 'admin-credentials.local';

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const confirmation = args.find((arg) => arg.startsWith('--confirm-project='))?.split('=')[1];
  if (args.some((arg) => arg !== '--apply' && !arg.startsWith('--confirm-project='))) {
    throw new Error('Usage: node scripts/reset-admin-accounts.mjs [--apply --confirm-project=PROJECT_REF]');
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !anonKey) {
    throw new Error('Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SECRET_KEY privately before running this script.');
  }
  const projectRef = new URL(url).hostname.split('.')[0];
  const adminEmail = (process.env.ADMIN_EMAIL || 'alexanderkebe@gmail.com').trim().toLowerCase();
  const clientOptions = { auth: { persistSession: false, autoRefreshToken: false } };
  const admin = createClient(url, key, clientOptions);
  const users = [];
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < 100) break;
  }
  const owner = users.find((user) => user.email?.toLowerCase() === adminEmail);
  const accounts = users.map(({ id, email }) => ({ id, email: email || null }))
    .sort((a, b) => a.id.localeCompare(b.id));
  const plan = { projectRef, adminEmail, accounts };

  if (!apply) {
    console.log(`Project: ${projectRef}`);
    console.log(`Administrator: ${adminEmail} (${owner ? 'reset existing account' : 'provision new account'})`);
    console.table(accounts.map((account) => ({ ...account, action: account.id === owner?.id ? 'Keep; reset password and grant super admin' : 'Delete account' })));
    await writeFile(PLAN_PATH, JSON.stringify(plan, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    console.log(`Review saved to ${PLAN_PATH}. No remote changes made.`);
    console.log('Account deletion also removes their profiles and article likes; author/comment/content attribution becomes unlinked. Site content and submissions are retained.');
    return;
  }

  if (confirmation !== projectRef) throw new Error('Apply requires --confirm-project matching the configured Supabase project.');
  const reviewedPlan = JSON.parse(await readFile(PLAN_PATH, 'utf8'));
  if (JSON.stringify(reviewedPlan) !== JSON.stringify(plan)) {
    throw new Error('Accounts or configuration changed since the plan was saved. Review a fresh plan before applying.');
  }
  const { data: settings, error: settingsError } = await admin.from('profiles').select('id').limit(1);
  if (settingsError || !settings) throw new Error('Cannot read profiles. Check the server credential and migrations.');
  const settingsResponse = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: anonKey } });
  if (!settingsResponse.ok) throw new Error('Unable to verify hosted signup settings.');
  const authSettings = await settingsResponse.json();
  if (authSettings.disable_signup !== true) {
    throw new Error('Disable new user signups in the hosted Supabase project before applying the reset.');
  }

  // An explicitly supplied password is useful for a deliberate admin reset;
  // otherwise generate a strong credential and preserve it locally.
  const password = process.env.ADMIN_PASSWORD || randomBytes(24).toString('base64url');
  if (process.env.ADMIN_PASSWORD && password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters.');
  }
  if (!process.env.ADMIN_PASSWORD) {
    await writeFile(CREDENTIAL_PATH, `Admin URL: https://www.beheretsigemariam.org/admin\nEmail: ${adminEmail}\nPassword: ${password}\n`, { flag: 'wx', mode: 0o600 });
  }
  const result = owner
    ? await admin.auth.admin.updateUserById(owner.id, { password, email_confirm: true, ban_duration: 'none' })
    : await admin.auth.admin.createUser({ email: adminEmail, password, email_confirm: true });
  if (result.error) throw result.error;
  const ownerId = result.data.user.id;
  const { error: profileError } = await admin.from('profiles').upsert({ id: ownerId, email: adminEmail, role: 'super_admin' }, { onConflict: 'id' });
  if (profileError) throw profileError;

  // Verify the replacement account before deleting any other account.
  const verifier = createClient(url, anonKey, clientOptions);
  const { error: loginError } = await verifier.auth.signInWithPassword({ email: adminEmail, password });
  if (loginError) throw loginError;
  const { data: profile, error: roleError } = await verifier.from('profiles').select('role').eq('id', ownerId).single();
  if (roleError || profile?.role !== 'super_admin') throw new Error('Replacement admin role verification failed. No other accounts were deleted.');
  const { error: signOutError } = await verifier.auth.signOut({ scope: 'global' });
  if (signOutError) throw signOutError;

  for (const account of accounts.filter(({ id }) => id !== ownerId)) {
    const { error } = await admin.auth.admin.deleteUser(account.id);
    if (error) throw new Error(`Stopped deleting accounts at ${account.id}: ${error.message}. Earlier changes may already have succeeded; inspect before retrying.`);
    console.log(`Deleted account ${account.id}`);
  }
  console.log(`Reset complete. Verified admin credentials are in ${CREDENTIAL_PATH}; store them in your password manager.`);
}

main().catch((error) => {
  console.error(`Admin reset stopped: ${error.message}`);
  process.exitCode = 1;
});

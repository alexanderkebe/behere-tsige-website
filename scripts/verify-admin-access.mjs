// Exercise Auth and RLS using the configured project. The temporary member and
// any unexpected probe content are removed before exiting. Never logs secrets.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const expectedProject = process.argv.find((arg) => arg.startsWith('--project='))?.slice(10);
assert.equal(new URL(url).hostname, `${expectedProject}.supabase.co`, 'Explicit --project must match environment');
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const service = createClient(url, process.env.SUPABASE_SECRET_KEY, options);
const publicClient = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, options);
const adminClient = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, options);
const memberClient = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, options);
const section = `verification-${randomUUID()}`;
let memberId;

try {
  const credentials = await readFile('admin-credentials.local', 'utf8');
  const email = credentials.match(/^Email: (.+)$/m)?.[1].trim();
  const password = credentials.match(/^Password: (.+)$/m)?.[1].trim();
  const { data: adminSession, error: adminLoginError } = await adminClient.auth.signInWithPassword({ email, password });
  assert.ifError(adminLoginError);
  const { data: profile, error: profileError } = await adminClient.from('profiles').select('role').eq('id', adminSession.user.id).single();
  assert.ifError(profileError);
  assert.equal(profile.role, 'super_admin');
  console.log('PASS: administrator email/password login and role');

  for (const table of ['site_content', 'fathers', 'members', 'events', 'media_links', 'annual_feasts', 'weekly_schedule', 'articles_with_stats', 'dejeselam_public']) {
    const { error } = await publicClient.from(table).select('*').limit(1);
    assert.ifError(error);
  }
  console.log('PASS: public site reads and both views');
  const { data: privateProfiles, error: privateError } = await publicClient.from('profiles').select('id');
  assert.ifError(privateError);
  assert.equal(privateProfiles.length, 0);
  const { error: anonymousWriteError } = await publicClient.from('site_content').insert({ section, data: { verification: true } });
  assert.ok(anonymousWriteError, 'Anonymous user unexpectedly wrote site content');
  console.log('PASS: anonymous visitors cannot read profiles or write site content');

  const memberEmail = `verification-${randomUUID()}@example.invalid`;
  const memberPassword = randomUUID() + randomUUID();
  const { data: created, error: createError } = await service.auth.admin.createUser({ email: memberEmail, password: memberPassword, email_confirm: true });
  assert.ifError(createError);
  memberId = created.user.id;
  const { error: memberLoginError } = await memberClient.auth.signInWithPassword({ email: memberEmail, password: memberPassword });
  assert.ifError(memberLoginError);
  const { data: memberProfile, error: memberProfileError } = await memberClient.from('profiles').select('role').eq('id', memberId).single();
  assert.ifError(memberProfileError);
  assert.equal(memberProfile.role, 'member');
  const { error: promotionError } = await memberClient.from('profiles').update({ role: 'super_admin' }).eq('id', memberId);
  assert.ok(promotionError, 'Member unexpectedly promoted their own role');
  const { error: memberWriteError } = await memberClient.from('site_content').insert({ section, data: { verification: true } });
  assert.ok(memberWriteError, 'Member unexpectedly wrote site content');
  const { error: roleRpcError } = await memberClient.rpc('admin_set_role', { target_id: adminSession.user.id, new_role: 'member' });
  assert.ok(roleRpcError, 'Member unexpectedly changed another account role');
  console.log('PASS: privately created member cannot promote themselves, change roles, or write content');

  const { error: writeError } = await adminClient.from('site_content').insert({ section, data: { verification: true } });
  assert.ifError(writeError);
  console.log('PASS: administrator can write site content');
  const response = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY } });
  assert.equal(response.ok, true);
  assert.equal((await response.json()).disable_signup, true);
  console.log('PASS: hosted public signup disabled');
} finally {
  const { error: cleanupError } = await service.from('site_content').delete().eq('section', section);
  if (cleanupError) { console.error(`Probe content cleanup failed: ${section}`); process.exitCode = 1; }
  if (memberId) {
    const { error } = await service.auth.admin.deleteUser(memberId);
    if (error) { console.error(`Temporary member cleanup failed: ${memberId}`); process.exitCode = 1; }
    else console.log('Removed temporary verification member.');
  }
  await Promise.allSettled([adminClient.auth.signOut({ scope: 'local' }), memberClient.auth.signOut({ scope: 'local' })]);
}

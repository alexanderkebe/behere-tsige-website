import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = fileURLToPath(new URL('./reset-admin-accounts.mjs', import.meta.url));
const owner = { id: '11111111-1111-4111-8111-111111111111', email: 'alexanderkebe@gmail.com' };
const other = { id: '22222222-2222-4222-8222-222222222222', email: 'member@example.test' };

async function fixture(t, { signupDisabled = true, loginFails = false } = {}) {
  const calls = [];
  const dir = await mkdtemp(path.join(tmpdir(), 'behere-admin-test-'));
  const server = createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    calls.push({ method: req.method, url: req.url, body: Buffer.concat(chunks).toString() });
    res.setHeader('content-type', 'application/json');
    const respond = (body, status = 200) => { res.statusCode = status; res.end(JSON.stringify(body)); };
    if (req.url.startsWith('/auth/v1/admin/users') && req.method === 'GET') return respond({ users: [owner, other] });
    if (req.url === '/auth/v1/settings') return respond({ disable_signup: signupDisabled });
    if (req.url.startsWith('/rest/v1/profiles') && req.method === 'GET') {
      return respond(req.headers.accept?.includes('object') ? { role: 'super_admin' } : [{ id: owner.id }]);
    }
    if (req.url.startsWith('/auth/v1/admin/users/') && req.method === 'PUT') return respond(owner);
    if (req.url.startsWith('/auth/v1/token')) {
      if (loginFails) return respond({ code: 'invalid_credentials', msg: 'Invalid login credentials' }, 400);
      return respond({ access_token: 'test-session', refresh_token: 'test-refresh', expires_in: 3600, token_type: 'bearer', user: owner });
    }
    if (req.url.startsWith('/auth/v1/user')) return respond(owner);
    return respond({});
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}`;
  const env = { ...process.env, NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon', SUPABASE_SECRET_KEY: 'test-secret', ADMIN_EMAIL: owner.email };
  async function run(...args) {
    return new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [script, ...args], { cwd: dir, env, windowsHide: true });
      let output = '';
      child.stdout.on('data', (data) => { output += data; });
      child.stderr.on('data', (data) => { output += data; });
      child.on('error', reject);
      child.on('close', (code) => resolve({ code, output }));
    });
  }
  return { calls, dir, run };
}

test('default mode saves the inventory without any remote mutation', async (t) => {
  const f = await fixture(t);
  const result = await f.run();
  assert.equal(result.code, 0, result.output);
  assert.ok(f.calls.every(({ method }) => method === 'GET'));
  const plan = JSON.parse(await readFile(path.join(f.dir, 'admin-reset-plan.local'), 'utf8'));
  assert.equal(plan.accounts.length, 2);
});

test('apply refuses a wrong project or a changed inventory', async (t) => {
  const f = await fixture(t);
  assert.equal((await f.run()).code, 0);
  assert.equal((await f.run('--apply', '--confirm-project=wrong')).code, 1);
  const planPath = path.join(f.dir, 'admin-reset-plan.local');
  const plan = JSON.parse(await readFile(planPath, 'utf8'));
  plan.accounts.pop();
  await writeFile(planPath, JSON.stringify(plan));
  const result = await f.run('--apply', '--confirm-project=127');
  assert.equal(result.code, 1);
  assert.match(result.output, /changed since the plan/);
  assert.ok(f.calls.every(({ method }) => method === 'GET'));
});

test('apply refuses public signup without changing credentials or accounts', async (t) => {
  const f = await fixture(t, { signupDisabled: false });
  await f.run();
  const result = await f.run('--apply', '--confirm-project=127');
  assert.equal(result.code, 1);
  assert.match(result.output, /Disable new user signups/);
  assert.ok(f.calls.every(({ method }) => method === 'GET'));
});

test('failed replacement login prevents deleting other accounts', async (t) => {
  const f = await fixture(t, { loginFails: true });
  await f.run();
  const result = await f.run('--apply', '--confirm-project=127');
  assert.equal(result.code, 1);
  assert.ok(!f.calls.some(({ method }) => method === 'DELETE'));
});

test('successful reset verifies login before deleting only the other account', async (t) => {
  const f = await fixture(t);
  await f.run();
  const result = await f.run('--apply', '--confirm-project=127');
  assert.equal(result.code, 0, result.output);
  const deleted = f.calls.filter(({ method }) => method === 'DELETE');
  assert.deepEqual(deleted.map(({ url }) => url), [`/auth/v1/admin/users/${other.id}`]);
  assert.ok(f.calls.findIndex(({ url }) => url.startsWith('/auth/v1/token')) < f.calls.findIndex(({ method }) => method === 'DELETE'));
  assert.match(await readFile(path.join(f.dir, 'admin-credentials.local'), 'utf8'), /Password: [A-Za-z0-9_-]{32}/);
  assert.ok(!result.output.includes('Password:'));
});

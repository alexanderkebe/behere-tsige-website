// Initialize an EMPTY Supabase project through the official Management API.
// Uses the existing SQL migrations and keeps CLI-compatible migration history.
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import nextEnv from '@next/env';

const root = fileURLToPath(new URL('../', import.meta.url));
nextEnv.loadEnvConfig(root);
const args = process.argv.slice(2);
const project = args.find((arg) => arg.startsWith('--project='))?.slice(10);
const apply = args.includes('--apply');

async function query(sql, readOnly = true) {
  const response = await fetch(`https://api.supabase.com/v1/projects/${project}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql, read_only: readOnly }),
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) throw new Error(`Database API HTTP ${response.status}: ${(await response.text()).slice(0, 800)}`);
  return response.json();
}

async function main() {
  if (!/^[a-z]{20}$/.test(project || '') || args.some((arg) => arg !== '--apply' && arg !== `--project=${project}`)) {
    throw new Error('Usage: node scripts/bootstrap-database.mjs --project=PROJECT_REF [--apply]');
  }
  if (!process.env.SUPABASE_ACCESS_TOKEN) throw new Error('SUPABASE_ACCESS_TOKEN is required.');
  const inventory = await query(`select
    (select count(*) from information_schema.tables where table_schema = 'public') as public_relations,
    (select count(*) from auth.users) as auth_users,
    (select count(*) from storage.objects) as storage_objects,
    (select count(*) from storage.buckets) as storage_buckets,
    (select count(*) from information_schema.schemata where schema_name = 'supabase_migrations') as migration_schemas`);
  console.log(`Target project: ${project}`);
  console.log(JSON.stringify(inventory));
  if (Object.values(inventory[0]).some((count) => Number(count) !== 0)) {
    throw new Error('Project is not empty. Bootstrap refuses to overwrite an existing database, Auth users, or storage.');
  }
  const dir = path.join(root, 'supabase/migrations');
  const files = (await readdir(dir)).filter((file) => /^\d+_.+\.sql$/.test(file)).sort();
  const versions = files.map((file) => file.split('_')[0]);
  if (new Set(versions).size !== versions.length) throw new Error('Duplicate migration versions.');
  const parts = [
    'begin;',
    `select pg_advisory_xact_lock(783946210);`,
    `do $empty_check$ begin
      if exists (select 1 from information_schema.tables where table_schema = 'public')
        or exists (select 1 from auth.users)
        or exists (select 1 from storage.objects)
        or exists (select 1 from storage.buckets)
        or exists (select 1 from information_schema.schemata where schema_name = 'supabase_migrations') then
        raise exception 'Project is no longer empty; refusing bootstrap';
      end if;
    end $empty_check$;`,
    'create schema supabase_migrations;',
    'create table supabase_migrations.schema_migrations (version text primary key, statements text[], name text);',
  ];
  for (const file of files) {
    const sql = await readFile(path.join(dir, file), 'utf8');
    const [, version, name] = file.match(/^(\d+)_(.+)\.sql$/);
    const delimiter = `$migration_${version}$`;
    if (sql.includes(delimiter) || name.includes("'")) throw new Error(`Unsafe migration filename or delimiter: ${file}`);
    parts.push(sql, `insert into supabase_migrations.schema_migrations (version, name, statements) values ('${version}', '${name}', array[${delimiter}${sql}${delimiter}]);`);
  }
  parts.push("notify pgrst, 'reload schema';", 'commit;');
  console.log(`${files.length} migrations prepared in one transaction (${Buffer.byteLength(parts.join('\n'))} bytes).`);
  if (!apply) { console.log('Preview only. No remote changes made.'); return; }
  await query(parts.join('\n'), false);
  console.log('Bootstrap committed.');
  console.log(JSON.stringify(await query(`select
    (select count(*) from supabase_migrations.schema_migrations) as migrations,
    (select count(*) from pg_tables where schemaname='public') as public_tables,
    (select count(*) from pg_views where schemaname='public') as public_views,
    (select count(*) from pg_tables where schemaname='public' and not rowsecurity) as tables_without_rls`)));
}

main().catch((error) => {
  console.error(error.message);
  console.error('If a network timeout occurred during apply, inspect the remote migration history before retrying.');
  process.exitCode = 1;
});

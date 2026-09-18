// Static coverage check only. Execute migrations on Supabase to validate SQL,
// grants, Auth integration, and RLS at runtime.
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const migrationDir = path.join(root, 'supabase/migrations');
const migrations = (await readdir(migrationDir)).filter((name) => /^\d+_.+\.sql$/.test(name)).sort();
const versions = migrations.map((name) => name.split('_')[0]);
assert.equal(new Set(versions).size, versions.length, 'Duplicate migration versions');
const tables = new Set();
const views = new Set();
const functions = new Set();
const rls = new Set();

for (const name of migrations) {
  const sql = await readFile(path.join(migrationDir, name), 'utf8');
  const declarations = /\b(create(?:\s+or\s+replace)?|drop)\s+(table|view|function)\s+(?:if\s+(?:not\s+)?exists\s+)?public\.(\w+)/gi;
  for (const match of sql.matchAll(declarations)) {
    const collection = match[2].toLowerCase() === 'table' ? tables : match[2].toLowerCase() === 'view' ? views : functions;
    if (match[1].toLowerCase() === 'drop') collection.delete(match[3]);
    else collection.add(match[3]);
  }
  for (const match of sql.matchAll(/alter\s+table\s+public\.(\w+)\s+enable\s+row\s+level\s+security/gi)) rls.add(match[1]);
}

async function* sourceFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* sourceFiles(file);
    else if (/\.[jt]sx?$/.test(entry.name)) yield file;
  }
}

const missing = [];
const queriedTables = new Set();
const calledFunctions = new Set();
for await (const file of sourceFiles(path.join(root, 'src'))) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/\.from\(\s*['"]([\w]+)['"]\s*\)/g)) {
    // The media storage bucket uses the same SDK method name as table queries.
    if (match[1] === 'media') continue;
    queriedTables.add(match[1]);
    if (!tables.has(match[1]) && !views.has(match[1])) missing.push(`${path.relative(root, file)}: missing relation ${match[1]}`);
  }
  for (const match of source.matchAll(/\.rpc\(\s*['"]([\w]+)['"]/g)) {
    calledFunctions.add(match[1]);
    if (!functions.has(match[1])) missing.push(`${path.relative(root, file)}: missing function ${match[1]}`);
  }
}
for (const table of tables) if (!rls.has(table)) missing.push(`No RLS enable statement found for ${table}`);
assert.equal(missing.length, 0, missing.join('\n'));
console.log(JSON.stringify({
  migrations: migrations.length,
  tables: [...tables].sort(),
  views: [...views].sort(),
  functions: [...functions].sort(),
  directRelationReferences: queriedTables.size,
  directRpcReferences: calledFunctions.size,
  result: 'Static coverage passed. Dynamic queries and runtime permissions still require live verification.',
}, null, 2));

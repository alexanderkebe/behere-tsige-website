import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split(/\r?\n/).forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const index = line.indexOf('=');
    if (index === -1) return;
    const key = line.substring(0, index).trim();
    let val = line.substring(index + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.substring(1, val.length - 1);
    }
    process.env[key] = val;
  });
}

const password = process.env.SUPABASE_DB_PASSWORD;
if (!password) {
  console.error("Error: SUPABASE_DB_PASSWORD not found in .env.local or process environment");
  process.exit(1);
}

const cmd = `npx supabase db push --password "${password}"`;

console.log("Pushing database migrations...");
try {
  execSync(cmd, { stdio: 'inherit' });
  console.log("Database migrations applied successfully.");
} catch (error) {
  console.error("Failed to push migrations:", error.message);
  process.exit(1);
}

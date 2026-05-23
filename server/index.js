import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import defaultContent from '../src/data/defaultContent.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_PATH = path.join(__dirname, '../data/content.json');
const PUBLIC_CONTENT_PATH = path.join(__dirname, '../public/content.json');
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'behere2026';

const tokens = new Set();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

async function ensureContentFile() {
  try {
    await fs.access(CONTENT_PATH);
  } catch {
    await fs.mkdir(path.dirname(CONTENT_PATH), { recursive: true });
    await writeContent(defaultContent);
  }
}

async function readContent() {
  await ensureContentFile();
  const raw = await fs.readFile(CONTENT_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function writeContent(data) {
  const json = JSON.stringify(data, null, 2);
  await fs.mkdir(path.dirname(CONTENT_PATH), { recursive: true });
  await fs.writeFile(CONTENT_PATH, json, 'utf-8');
  await fs.mkdir(path.dirname(PUBLIC_CONTENT_PATH), { recursive: true });
  await fs.writeFile(PUBLIC_CONTENT_PATH, json, 'utf-8');
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token || !tokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.get('/api/content', async (_req, res) => {
  try {
    const content = await readContent();
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load content' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body || {};
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  const token = crypto.randomBytes(32).toString('hex');
  tokens.add(token);
  res.json({ token });
});

app.put('/api/content', authMiddleware, async (req, res) => {
  try {
    await writeContent(req.body);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

app.post('/api/auth/logout', authMiddleware, (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  tokens.delete(token);
  res.json({ ok: true });
});

const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

await ensureContentFile();
app.listen(PORT, () => {
  console.log(`Content API running at http://localhost:${PORT}`);
  console.log(`Admin password: set ADMIN_PASSWORD env (default: behere2026)`);
});

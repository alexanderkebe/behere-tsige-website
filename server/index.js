const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');
const jwt = require('jsonwebtoken');
const defaultContent = require('../src/data/defaultContent.js');

const __dirname = path.dirname(__filename);
const CONTENT_PATH = path.join(__dirname, '../data/content.json');
const PUBLIC_CONTENT_PATH = path.join(__dirname, '../public/content.json');
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'behere2026';
const JWT_SECRET = process.env.JWT_SECRET || 'behere-secret-key-2026';

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
  
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
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
  const token = jwt.sign({ authenticated: true }, JWT_SECRET, { expiresIn: '24h' });
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
  // With JWT tokens, logout is handled client-side by removing the token
  // No server-side action needed
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

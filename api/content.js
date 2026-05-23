const fs = require('fs/promises');
const path = require('path');
const jwt = require('jsonwebtoken');

const defaultContentPath = path.join(__dirname, '../src/data/defaultContent.js');

const CONTENT_PATH = path.join(process.cwd(), 'data/content.json');
const PUBLIC_CONTENT_PATH = path.join(process.cwd(), 'public/content.json');
const JWT_SECRET = process.env.JWT_SECRET || 'behere-secret-key-2026';

async function loadDefaultContent() {
  const raw = await fs.readFile(defaultContentPath, 'utf-8');
  // Remove export statement to parse JSON
  const jsonContent = raw.replace('export default ', '');
  return JSON.parse(jsonContent);
}

async function ensureContentFile() {
  try {
    await fs.access(CONTENT_PATH);
  } catch {
    await fs.mkdir(path.dirname(CONTENT_PATH), { recursive: true });
    const defaultContent = await loadDefaultContent();
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

function verifyToken(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const content = await readContent();
      res.json(content);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to load content' });
    }
  } else if (req.method === 'PUT') {
    const decoded = verifyToken(req);
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      await writeContent(req.body);
      res.json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save content' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

module.exports = handler;

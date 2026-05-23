const jwt = require('jsonwebtoken');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'behere2026';
const JWT_SECRET = process.env.JWT_SECRET || 'behere-secret-key-2026';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign({ authenticated: true }, JWT_SECRET, { expiresIn: '24h' });
  
  res.json({ token });
};
